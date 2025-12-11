// src/pages/ConfigPage.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuote } from "../state/QuoteContext";

export default function ConfigPage() {
  const nav = useNavigate();
  const {
    colors,
    options,
    selectedColorCode,
    setSelectedColorCode,
    selectedOptionCodes,
    setSelectedOptionCodes,
    currentCar,
    subtotal,
  } = useQuote();

  // currentCar가 없으면 차량 선택 페이지로 리다이렉트
  useEffect(() => {
    if (!currentCar) {
      nav('/models');
    }
  }, [currentCar, nav]);

  // 페이지 진입 시 선택 초기화 (첫 번째 색상, 옵션 없음)
  useEffect(() => {
    if (colors.length > 0) {
      setSelectedColorCode(colors[0].code); // 첫 번째 색상
    }
    setSelectedOptionCodes([]); // 옵션 전부 해제
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 페이지 마운트 시 한 번만 실행

  const toggleOption = (code) => {
    setSelectedOptionCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // currentCar가 로딩 중일 때 로딩 표시
  if (!currentCar) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>차량 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="config-layout">
      {/* 왼쪽: 선택된 차량 이미지 */}
      <div className="car-display">
        <h2>선택된 차량</h2>
        <div className="selected-car">
          <img src={currentCar.image} alt={currentCar.name} />
          <h3>{currentCar.name}</h3>
        </div>
      </div>

      {/* 오른쪽: 색상/옵션 선택 */}
      <div className="options-panel">
        <section className="color-selection">
          <h2>색상 선택</h2>
          <div className="colors">
            {colors.map((c) => (
              <div
                key={c.code}
                className={`color-option ${selectedColorCode === c.code ? "selected" : ""}`}
                onClick={() => setSelectedColorCode(c.code)}
              >
                <div
                  className="color-swatch"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="color-info">
                  <span className="color-name">{c.name}</span>
                  {c.price ? (
                    <span className="color-price">+{c.price.toLocaleString()}원</span>
                  ) : (
                    <span className="color-price">기본</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="options-selection">
          <h2>옵션 선택</h2>
          <div className="options-grid">
            {options.map((o) => (
              <label
                key={o.code}
                className="option-card"
                style={{ cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={selectedOptionCodes.includes(o.code)}
                  onChange={() => toggleOption(o.code)}
                  style={{ marginRight: 8 }}
                />
                <strong>{o.name}</strong>
                <div style={{ marginTop: 6 }}>+ {o.price.toLocaleString()}원</div>
              </label>
            ))}
          </div>
        </section>

        <section className="price-summary">
          <h2>현재 합계</h2>
          <div className="price-calculator">
            <div className="price-breakdown">
              <div>기본 가격: {currentCar.basePrice.toLocaleString()}원</div>
              <div className="total">
                현재 소계: {subtotal.toLocaleString()}원
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="quote-button" onClick={() => nav("/models")}>
              ← 이전
            </button>
            <button className="quote-button" onClick={() => nav("/summary")}>
              상세 견적 보기 →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
