// src/state/QuoteContext.jsx
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getAllCars, getAllColors, getAllOptions } from "../services/carsService";

const QuoteCtx = createContext(null);
export const useQuote = () => useContext(QuoteCtx);

export function QuoteProvider({ children }) {
  // API에서 가져올 데이터
  const [cars, setCars] = useState([]);
  const [colors, setColors] = useState([]);
  const [options, setOptions] = useState([]);

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 선택된 값들
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [selectedColorCode, setSelectedColorCode] = useState(null);
  const [selectedOptionCodes, setSelectedOptionCodes] = useState([]); // 다중 선택

  // 할인/탁송 (상세 견적 페이지에서 입력/선택)
  const [discount, setDiscount] = useState({ name: "", amount: 0 }); // 금액형
  const [delivery, setDelivery] = useState({ region: "", fee: 0 }); // 탁송비

  // 견적 수정 모드
  const [editingQuoteId, setEditingQuoteId] = useState(null); // 수정 중인 견적 ID

  // API에서 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 백엔드에서 데이터 로딩 시작...');

        // 병렬로 API 호출
        const [carsRes, colorsRes, optionsRes] = await Promise.all([
          getAllCars(),
          getAllColors(),
          getAllOptions()
        ]);

        console.log('✅ API 응답 받음:', {
          cars: carsRes.data?.length || 0,
          colors: colorsRes.data?.length || 0,
          options: optionsRes.data?.length || 0
        });

        // API 응답에서 데이터 추출
        const carsData = carsRes.data || [];
        const colorsData = colorsRes.data || [];
        const optionsData = optionsRes.data || [];

        // Oracle DB는 대문자 키를 반환할 수 있으므로 정규화
        const normalizedCars = carsData.map(car => ({
          id: car.ID || car.id,
          name: car.NAME || car.name,
          basePrice: car.basePrice || car.BASE_PRICE || car.BASEPRICE,
          image: car.image || car.IMAGE || car.IMAGE_URL || car.IMAGEURL,
          brand: car.BRAND || car.brand,
          engine: car.ENGINE || car.engine,
          power: car.POWER || car.power,
          fuelEfficiency: car.fuelEfficiency || car.FUEL_EFFICIENCY || car.FUELEFFICIENCY,
          safetyRating: car.safetyRating || car.SAFETY_RATING || car.SAFETYRATING,
          dimensions: car.DIMENSIONS || car.dimensions,
          description: car.DESCRIPTION || car.description,
          features: car.features || []
        }));

        const normalizedColors = colorsData.map(color => ({
          id: color.ID || color.id,
          code: color.CODE || color.code,
          name: color.NAME || color.name,
          hex: color.HEX || color.hex,
          price: color.PRICE || color.price || 0
        }));

        const normalizedOptions = optionsData.map(option => ({
          id: option.ID || option.id,
          code: option.CODE || option.code,
          name: option.NAME || option.name,
          price: option.PRICE || option.price || 0
        }));

        setCars(normalizedCars);
        setColors(normalizedColors);
        setOptions(normalizedOptions);

        console.log('✅ 데이터 정규화 완료:', {
          cars: normalizedCars.length,
          colors: normalizedColors.length,
          options: normalizedOptions.length
        });
        console.log('📊 로드된 차량:', normalizedCars.map(c => c.name));

        // 기본값 설정 (로컬 스토리지에서 복원하거나 첫 번째 항목 선택)
        const saved = localStorage.getItem("quoteState");
        if (saved) {
          try {
            const s = JSON.parse(saved);
            setSelectedCarId(s.selectedCarId ?? normalizedCars[0]?.id);
            setSelectedColorCode(s.selectedColorCode ?? normalizedColors[0]?.code);
            setSelectedOptionCodes(s.selectedOptionCodes ?? []);
            setDiscount(s.discount ?? { name: "", amount: 0 });
            setDelivery(s.delivery ?? { region: "", fee: 0 });
          } catch (e) {
            // 로컬 스토리지 파싱 실패 시 기본값
            setSelectedCarId(normalizedCars[0]?.id);
            setSelectedColorCode(normalizedColors[0]?.code);
          }
        } else {
          // 로컬 스토리지에 저장된 값이 없으면 기본값
          setSelectedCarId(normalizedCars[0]?.id);
          setSelectedColorCode(normalizedColors[0]?.code);
        }

        setLoading(false);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError(err.message || "데이터를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 선택 값들을 로컬 스토리지에 저장
  useEffect(() => {
    if (selectedCarId && selectedColorCode) {
      localStorage.setItem(
        "quoteState",
        JSON.stringify({
          selectedCarId,
          selectedColorCode,
          selectedOptionCodes,
          discount,
          delivery,
        })
      );
    }
  }, [
    selectedCarId,
    selectedColorCode,
    selectedOptionCodes,
    discount,
    delivery,
  ]);

  const currentCar = useMemo(
    () => cars.find((c) => c.id === selectedCarId),
    [cars, selectedCarId]
  );

  const currentColor = useMemo(
    () => colors.find((c) => c.code === selectedColorCode),
    [colors, selectedColorCode]
  );

  const selectedOptions = useMemo(
    () => options.filter((o) => selectedOptionCodes.includes(o.code)),
    [options, selectedOptionCodes]
  );

  const subtotal =
    (currentCar?.basePrice ?? 0) +
    (currentColor?.price ?? 0) +
    selectedOptions.reduce((a, o) => a + o.price, 0);

  const total = Math.max(
    0,
    subtotal - (discount.amount || 0) + (delivery.fee || 0)
  );

  // 견적 수정을 위해 데이터 로드
  const loadQuoteForEdit = (quote) => {
    setEditingQuoteId(quote.id || quote.ID);
    setSelectedCarId(quote.carId || quote.CARID);
    setSelectedColorCode(quote.colorCode || quote.COLORCODE);

    // 옵션 코드 추출
    const optionCodes = quote.options
      ? quote.options.map(o => o.optionCode || o.OPTIONCODE)
      : (quote.optionCodes || []);
    setSelectedOptionCodes(optionCodes);

    setDiscount({
      name: quote.discountName || quote.DISCOUNTNAME || '',
      amount: quote.discountAmount || quote.DISCOUNTAMOUNT || 0
    });
    setDelivery({
      region: quote.deliveryRegion || quote.DELIVERYREGION || '',
      fee: quote.deliveryFee || quote.DELIVERYFEE || 0
    });
  };

  // 편집 모드 종료
  const clearEditMode = () => {
    setEditingQuoteId(null);
  };

  const value = {
    cars,
    colors,
    options,
    loading,
    error,
    selectedCarId,
    setSelectedCarId,
    selectedColorCode,
    setSelectedColorCode,
    selectedOptionCodes,
    setSelectedOptionCodes,
    currentCar,
    currentColor,
    selectedOptions,
    discount,
    setDiscount,
    delivery,
    setDelivery,
    subtotal,
    total,
    // 견적 수정 관련
    editingQuoteId,
    loadQuoteForEdit,
    clearEditMode,
  };

  return <QuoteCtx.Provider value={value}>{children}</QuoteCtx.Provider>;
}
