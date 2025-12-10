// src/pages/MyQuotesPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyQuotes, deleteQuote } from "../services/quotesService";
import { useQuote } from "../state/QuoteContext";

export default function MyQuotesPage() {
  const navigate = useNavigate();
  const { loadQuoteForEdit } = useQuote();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 상세보기 모달
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    loadMyQuotes();
  }, []);

  const loadMyQuotes = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📋 내 견적 목록 로딩 시작...');

      // 서버에서 내 견적 목록 가져오기
      const response = await getMyQuotes();

      console.log('✅ 로드된 견적:', response.data);

      setQuotes(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('❌ 견적 목록 로드 실패:', err);

      // 401 에러 (로그인 필요)인 경우 빈 배열로 처리
      if (err.response?.status === 401) {
        setError('로그인이 필요합니다.');
      } else {
        setError('견적 목록을 불러오는데 실패했습니다.');
      }

      setQuotes([]);
      setLoading(false);
    }
  };

  const handleViewDetail = (quote) => {
    console.log('👀 견적 상세보기:', quote);
    setSelectedQuote(quote);
    setShowDetailModal(true);
  };

  const handleEdit = (quote) => {
    console.log('✏️ 견적 수정 시작:', quote);

    // QuoteContext에 견적 데이터 로드
    loadQuoteForEdit(quote);

    // 색상/옵션 선택 페이지로 이동
    navigate('/config');
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('이 견적을 삭제하시겠습니까?')) {
      return;
    }

    try {
      console.log('🗑️ 견적 삭제 시작:', quoteId);

      await deleteQuote(quoteId);

      // 목록에서 제거
      setQuotes(quotes.filter(q => (q.ID || q.id) !== quoteId));

      console.log('✅ 견적 삭제 완료');
      alert('견적이 삭제되었습니다.');
    } catch (err) {
      console.error('❌ 견적 삭제 실패:', err);
      alert(err.response?.data?.message || '견적 삭제에 실패했습니다.');
    }
  };

  const normalizeQuote = (quote) => ({
    id: quote.ID || quote.id,
    carId: quote.carId || quote.CARID,
    carName: quote.carName || quote.CARNAME,
    carBrand: quote.carBrand || quote.CARBRAND,
    carBasePrice: quote.carBasePrice || quote.CARBASEPRICE || 0,
    carImageUrl: quote.carImageUrl || quote.CARIMAGEURL,
    colorCode: quote.colorCode || quote.COLORCODE,
    colorName: quote.colorName || quote.COLORNAME,
    colorHex: quote.colorHex || quote.COLORHEX,
    options: quote.options || quote.OPTIONS || [],
    discountName: quote.discountName || quote.DISCOUNTNAME || quote.DISCOUNT_NAME,
    discountAmount: quote.discountAmount || quote.DISCOUNTAMOUNT || quote.DISCOUNT_AMOUNT || 0,
    deliveryRegion: quote.deliveryRegion || quote.DELIVERYREGION || quote.DELIVERY_REGION,
    deliveryFee: quote.deliveryFee || quote.DELIVERYFEE || quote.DELIVERY_FEE || 0,
    subtotal: quote.subtotal || quote.SUBTOTAL || 0,
    total: quote.total || quote.TOTAL || 0,
    createdAt: quote.createdAt || quote.CREATEDAT || quote.CREATED_AT
  });

  if (loading) {
    return (
      <section className="price-section">
        <h2>📋 내 견적 목록</h2>
        <div style={{ textAlign: 'center', padding: 40 }}>
          로딩 중...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="price-section">
        <h2>📋 내 견적 목록</h2>
        <div style={{ textAlign: 'center', padding: 40, color: '#d32f2f' }}>
          {error}
        </div>
      </section>
    );
  }

  if (quotes.length === 0) {
    return (
      <section className="price-section">
        <h2>📋 내 견적 목록</h2>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p>저장된 견적이 없습니다.</p>
          <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
            차량을 선택하고 견적을 저장해보세요!
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* 상세보기 모달 */}
      {showDetailModal && selectedQuote && (() => {
        const normalized = normalizeQuote(selectedQuote);
        return (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
            }}
            onClick={() => setShowDetailModal(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '40px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
                  견적 상세보기
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '32px',
                    cursor: 'pointer',
                    color: '#666',
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ borderBottom: '2px solid #e0e0e0', marginBottom: '24px' }} />

              {/* 차량 이미지 */}
              {normalized.carImageUrl && (
                <div style={{ marginBottom: '32px' }}>
                  <img
                    src={normalized.carImageUrl}
                    alt={`${normalized.carBrand} ${normalized.carName}`}
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* 차량 정보 */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
                  🚗 차량 정보
                </h3>
                <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: '#111' }}>
                    {normalized.carBrand} {normalized.carName}
                  </div>
                  <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
                    견적 번호: {normalized.id}
                  </div>
                  <div style={{ fontSize: '18px', color: '#1976d2', fontWeight: '600' }}>
                    기본 가격: {normalized.carBasePrice.toLocaleString()}원
                  </div>
                </div>
              </div>

              {/* 색상 정보 */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
                  🎨 색상
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '12px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: normalized.colorHex || '#ccc',
                    border: '3px solid #fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }} />
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#111' }}>
                      {normalized.colorName}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      코드: {normalized.colorCode}
                    </div>
                  </div>
                </div>
              </div>

              {/* 옵션 */}
              {normalized.options.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
                    ⚙️ 선택 옵션
                  </h3>
                  <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px' }}>
                    {normalized.options.map((option, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px',
                          marginBottom: idx < normalized.options.length - 1 ? '8px' : 0,
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>
                          {option.optionName || option.OPTIONNAME}
                        </span>
                        <span style={{ fontSize: '16px', color: '#1976d2', fontWeight: '600' }}>
                          +{(option.optionPrice || option.OPTIONPRICE || 0).toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 가격 계산 */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
                  💰 가격 계산
                </h3>
                <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '16px' }}>
                    <span>차량 기본 가격</span>
                    <span style={{ fontWeight: '600' }}>{normalized.carBasePrice.toLocaleString()}원</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '16px', color: '#666' }}>
                    <span>옵션 추가</span>
                    <span style={{ fontWeight: '600', color: '#1976d2' }}>
                      +{normalized.options.reduce((sum, o) => sum + (o.optionPrice || o.OPTIONPRICE || 0), 0).toLocaleString()}원
                    </span>
                  </div>
                  {normalized.discountName && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '16px', color: '#666' }}>
                      <span>할인 ({normalized.discountName})</span>
                      <span style={{ fontWeight: '600', color: '#d32f2f' }}>
                        -{normalized.discountAmount.toLocaleString()}원
                      </span>
                    </div>
                  )}
                  {normalized.deliveryRegion && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '16px', color: '#666' }}>
                      <span>배송비 ({normalized.deliveryRegion})</span>
                      <span style={{ fontWeight: '600', color: '#1976d2' }}>
                        +{normalized.deliveryFee.toLocaleString()}원
                      </span>
                    </div>
                  )}
                  <div style={{ borderTop: '2px solid #ddd', marginTop: '12px', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px' }}>
                      <span style={{ fontWeight: '700' }}>총액</span>
                      <span style={{ fontWeight: '700', color: '#1976d2' }}>
                        {normalized.total.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 생성일 */}
              {normalized.createdAt && (
                <div style={{ fontSize: '14px', color: '#999', marginBottom: '24px', textAlign: 'center' }}>
                  저장일: {new Date(normalized.createdAt).toLocaleString('ko-KR')}
                </div>
              )}

              {/* 액션 버튼 */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="quote-button"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedQuote);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#1976d2',
                    color: 'white',
                    padding: '14px',
                  }}
                >
                  ✏️ 수정
                </button>
                <button
                  className="quote-button"
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    backgroundColor: '#4caf50',
                    color: 'white',
                    padding: '14px',
                  }}
                >
                  🖨️ 인쇄
                </button>
                <button
                  className="quote-button"
                  onClick={() => {
                    if (window.confirm('이 견적을 삭제하시겠습니까?')) {
                      setShowDetailModal(false);
                      handleDelete(normalized.id);
                    }
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    padding: '14px',
                  }}
                >
                  🗑️ 삭제
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <section className="price-section">
        <h2>📋 내 견적 목록 ({quotes.length}개)</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {quotes.map((quote) => {
          const normalized = normalizeQuote(quote);
          return (
            <div
              key={normalized.id}
              className="price-calculator"
              style={{
                position: 'relative',
                padding: 20,
                border: '2px solid #e0e0e0',
                borderRadius: 8
              }}
            >
              <div className="price-breakdown">
                <div>
                  <strong>견적 번호:</strong> {normalized.id}
                </div>
                <div>
                  <strong>차량:</strong> {normalized.carBrand} {normalized.carName}
                </div>
                <div>
                  <strong>색상:</strong> {normalized.colorName}
                </div>
                <div>
                  <strong>기본 가격:</strong> {normalized.carBasePrice.toLocaleString()}원
                </div>
                {normalized.options.length > 0 && (
                  <div>
                    <strong>옵션:</strong>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                      {normalized.options.map((option, idx) => (
                        <li key={idx}>
                          {option.optionName || option.OPTIONNAME} (+{(option.optionPrice || option.OPTIONPRICE || 0).toLocaleString()}원)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {normalized.discountName && (
                  <div>
                    <strong>할인:</strong> {normalized.discountName} (-{normalized.discountAmount.toLocaleString()}원)
                  </div>
                )}
                {normalized.deliveryRegion && (
                  <div>
                    <strong>배송지:</strong> {normalized.deliveryRegion} (+{normalized.deliveryFee.toLocaleString()}원)
                  </div>
                )}
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #e0e0e0' }}>
                  <strong>소계:</strong> {normalized.subtotal.toLocaleString()}원
                </div>
                <div className="total">
                  <strong>총액:</strong> {normalized.total.toLocaleString()}원
                </div>
                {normalized.createdAt && (
                  <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                    저장일: {new Date(normalized.createdAt).toLocaleString('ko-KR')}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button
                  className="quote-button"
                  onClick={() => handleViewDetail(quote)}
                  style={{
                    backgroundColor: '#4caf50',
                    color: 'white'
                  }}
                >
                  ℹ️ 상세보기
                </button>
                <button
                  className="quote-button"
                  onClick={() => handleEdit(quote)}
                  style={{
                    backgroundColor: '#1976d2',
                    color: 'white'
                  }}
                >
                  ✏️ 수정
                </button>
                <button
                  className="quote-button"
                  onClick={() => handleDelete(normalized.id)}
                  style={{
                    backgroundColor: '#d32f2f',
                    color: 'white'
                  }}
                >
                  🗑️ 삭제
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
    </>
  );
}
