import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuote } from "../state/QuoteContext";
import { getBrandInfo } from "../services/brandsService";

export default function BrandsPage() {
  const navigate = useNavigate();
  const { cars } = useQuote();
  const [brandInfo, setBrandInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrandInfo = async () => {
      try {
        setLoading(true);
        const response = await getBrandInfo();

        if (response.success) {
          const brand = response.data;
          // JSON 필드 파싱
          const parsedBrand = {
            ...brand,
            keyTech: typeof brand.keyTech === 'string'
              ? JSON.parse(brand.keyTech)
              : brand.keyTech,
            values: typeof brand.values === 'string'
              ? JSON.parse(brand.values)
              : brand.values
          };
          setBrandInfo(parsedBrand);
        } else {
          setError('브랜드 정보를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('브랜드 정보 조회 오류:', err);
        setError('브랜드 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrandInfo();
  }, []);

  if (loading) {
    return (
      <div className="brands-page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>브랜드 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brands-page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!brandInfo) {
    return (
      <div className="brands-page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>브랜드 정보가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="brands-page">
      {/* 브랜드 헤더 */}
      <div className="single-brand-header">
        <div className="brand-logo-large">{brandInfo.logo}</div>
        <h1>{brandInfo.name}</h1>
        <p className="brand-tagline-large">{brandInfo.tagline}</p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="single-brand-content">
        {/* 브랜드 소개 */}
        <section className="brand-section">
          <h2>회사 소개</h2>
          <p className="section-description">{brandInfo.description}</p>
        </section>

        {/* 핵심 서비스 */}
        <section className="brand-section">
          <h2>핵심 서비스</h2>
          <div className="service-grid">
            {brandInfo.keyTech.map((service, index) => (
              <div key={index} className="service-item">
                <span className="service-icon">✓</span>
                <span>{service}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 핵심 가치 */}
        <section className="brand-section">
          <h2>핵심 가치</h2>
          <div className="values-grid">
            {brandInfo.values.map((value, index) => (
              <div key={index} className="value-card">
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 취급 차량 */}
        <section className="brand-section">
          <h2>취급 차량</h2>
          <p className="section-subtitle">엄선된 프리미엄 차량을 만나보세요</p>
          <div className="vehicles-showcase">
            {cars.map((car) => (
              <div
                key={car.id}
                className="vehicle-showcase-item"
                onClick={() => navigate(`/vehicles/${car.id}`)}
              >
                <img src={car.image} alt={car.name} />
                <div className="vehicle-showcase-info">
                  <h3>{car.name}</h3>
                  <p className="vehicle-brand">{car.brand}</p>
                  <p className="vehicle-price">{car.basePrice.toLocaleString()}원~</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 철학 */}
        <section className="brand-section philosophy-section">
          <blockquote className="brand-philosophy-quote">
            "{brandInfo.philosophy}"
          </blockquote>
          <p className="philosophy-subtext">{brandInfo.heritage}</p>
        </section>
      </div>

      {/* 푸터 액션 */}
      <div className="brands-footer">
        <button className="quote-button" onClick={() => navigate("/models")}>
          차량 견적 시작하기
        </button>
      </div>
    </div>
  );
}
