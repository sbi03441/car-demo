// src/pages/SummaryPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuote } from "../state/QuoteContext";
import { saveQuote, updateQuote } from "../services/quotesService";
import { useAuth } from "../context/AuthContext";

export default function SummaryPage() {
  const nav = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    currentCar,
    currentColor,
    selectedOptions,
    selectedOptionCodes,
    discount,
    setDiscount,
    delivery,
    setDelivery,
    subtotal,
    total,
    editingQuoteId,
    clearEditMode,
  } = useQuote();

  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // currentCar나 currentColor가 없으면 차량 선택 페이지로 리다이렉트
  useEffect(() => {
    if (!currentCar || !currentColor) {
      nav('/models');
    }
  }, [currentCar, currentColor, nav]);

  const handleSaveQuote = async () => {
    // 로그인 체크
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      setSaving(true);

      const isEditing = editingQuoteId !== null;
      console.log(isEditing ? '✏️ 견적 수정 시작...' : '💾 견적 저장 시작...');

      // API에 전송할 데이터 준비
      const quoteData = {
        carId: currentCar.id,
        colorCode: currentColor.code,
        optionCodes: selectedOptionCodes,
        discountName: discount.name || '',
        discountAmount: discount.amount || 0,
        deliveryRegion: delivery.region || '',
        deliveryFee: delivery.fee || 0,
        subtotal: subtotal,
        total: total
      };

      console.log('📤 전송 데이터:', quoteData);

      let response;
      if (isEditing) {
        // 수정 모드: PUT 요청
        response = await updateQuote(editingQuoteId, quoteData);
        console.log('✅ 수정 성공:', response);
        clearEditMode(); // 편집 모드 종료
      } else {
        // 새로 저장: POST 요청
        response = await saveQuote(quoteData);
        console.log('✅ 저장 성공:', response);
      }

      // 성공 모달 표시
      setShowSuccessModal(true);

    } catch (error) {
      console.error('❌ 견적 저장/수정 실패:', error);
      alert(error.response?.data?.message || '견적 저장/수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    nav('/');
  };

  const handleLoginModalConfirm = () => {
    setShowLoginModal(false);
    nav('/login');
  };

  const handleDownload = () => {
    const payload = {
      차량정보: {
        모델: currentCar.name,
        기본가: currentCar.basePrice,
        색상: currentColor.name,
        색상추가: currentColor.price,
        옵션: selectedOptions.map((o) => ({ name: o.name, price: o.price })),
      },
      할인정보: discount,
      탁송정보: delivery,
      합계: { 소계: subtotal, 총액: total },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "quote.json";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  // currentCar나 currentColor가 로딩 중일 때
  if (!currentCar || !currentColor) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>견적 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      {/* 로그인 필요 모달 */}
      {showLoginModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowLoginModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: '#111' }}>
              로그인이 필요합니다
            </h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
              견적을 저장하려면 로그인이 필요합니다.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowLoginModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#e0e0e0')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
              >
                취소
              </button>
              <button
                onClick={handleLoginModalConfirm}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#333')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#000')}
              >
                로그인하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={handleModalConfirm}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: '#111' }}>
              {editingQuoteId ? '견적 수정 완료!' : '견적 저장 완료!'}
            </h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
              {editingQuoteId ? '견적이 성공적으로 수정되었습니다.' : '견적이 성공적으로 저장되었습니다.'}
            </p>
            <button
              onClick={handleModalConfirm}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#333')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#000')}
            >
              확인
            </button>
          </div>
        </div>
      )}

      <section className="price-section">
        <h2>3️⃣ 상세 견적</h2>

        {/* 차량정보 */}
        <div className="price-calculator" style={{ marginBottom: 16 }}>
          <h3>차량정보</h3>
          <div className="price-breakdown">
            <div>
              모델: <strong>{currentCar.name}</strong>
            </div>
            <div>기본 가격: {currentCar.basePrice.toLocaleString()}원</div>
            <div>
              색상: {currentColor.name} (+{currentColor.price.toLocaleString()}
              원)
            </div>
            <div>
              옵션:
              {selectedOptions.length === 0
                ? " (없음)"
                : selectedOptions
                    .map((o) => ` ${o.name}(+${o.price.toLocaleString()}원)`)
                    .join(",")}
            </div>
            <div className="total">소계: {subtotal.toLocaleString()}원</div>
          </div>
        </div>

        {/* 할인정보 입력 */}
        <div className="price-calculator" style={{ marginBottom: 16 }}>
          <h3>할인정보</h3>
          <div className="price-breakdown">
            <div>
              명칭:
              <input
                style={{ marginLeft: 8 }}
                value={discount.name}
                onChange={(e) =>
                  setDiscount({ ...discount, name: e.target.value })
                }
                placeholder="예: 프로모션A"
              />
            </div>
            <div>
              할인 금액:
              <input
                type="number"
                style={{ marginLeft: 8 }}
                value={discount.amount}
                onChange={(e) =>
                  setDiscount({
                    ...discount,
                    amount: Number(e.target.value || 0),
                  })
                }
                min={0}
              />{" "}
              원
            </div>
          </div>
        </div>

        {/* 탁송정보 입력 */}
        <div className="price-calculator">
          <h3>탁송정보</h3>
          <div className="price-breakdown">
            <div>
              지역:
              <input
                style={{ marginLeft: 8 }}
                value={delivery.region}
                onChange={(e) =>
                  setDelivery({ ...delivery, region: e.target.value })
                }
                placeholder="예: 부산"
              />
            </div>
            <div>
              탁송비:
              <input
                type="number"
                style={{ marginLeft: 8 }}
                value={delivery.fee}
                onChange={(e) =>
                  setDelivery({ ...delivery, fee: Number(e.target.value || 0) })
                }
                min={0}
              />{" "}
              원
            </div>
          </div>
        </div>

        {/* 총액 */}
        <div className="price-calculator" style={{ marginTop: 16 }}>
          <h3>총액</h3>
          <div className="price-breakdown">
            <div className="total">{total.toLocaleString()}원</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button className="quote-button" onClick={() => nav("/config")}>
            ← 색상/옵션 수정
          </button>
          <button
            className="quote-button"
            onClick={handleSaveQuote}
            disabled={saving}
            style={{
              backgroundColor: saving ? '#ccc' : undefined,
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            {saving
              ? (editingQuoteId ? '✏️ 수정 중...' : '💾 저장 중...')
              : (editingQuoteId ? '✏️ 견적 업데이트' : '💾 견적 저장')
            }
          </button>
          {/* 견적서 다운로드 기능 - 일시적으로 비활성화 */}
          {/* <button className="quote-button" onClick={handleDownload}>
            📄 견적서 다운로드
          </button> */}
        </div>
      </section>
    </>
  );
}
