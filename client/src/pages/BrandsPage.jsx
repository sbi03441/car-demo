import { useNavigate } from "react-router-dom";
import { useQuote } from "../state/QuoteContext";

// 단일 브랜드 정보
const brandInfo = {
  name: "Car Demo",
  logo: "🚗",
  tagline: "프리미엄 자동차의 새로운 기준",
  description:
    "Car Demo는 고객에게 최상의 자동차 구매 경험을 제공하는 프리미엄 자동차 딜러입니다. 엄선된 프리미엄 차량과 전문적인 컨설팅으로 고객의 라이프스타일에 맞는 최적의 차량을 찾아드립니다.",
  heritage: "신뢰와 품질을 바탕으로 한 프리미엄 자동차 서비스",
  keyTech: [
    "온라인 실시간 견적 시스템",
    "전문 상담 서비스",
    "투명한 가격 정책",
    "편리한 탁송 서비스"
  ],
  philosophy: "고객의 꿈을 현실로 만드는 파트너",
  values: [
    { title: "신뢰", description: "투명하고 정직한 거래" },
    { title: "전문성", description: "차량에 대한 깊은 이해와 전문 지식" },
    { title: "고객만족", description: "고객의 니즈를 최우선으로" }
  ]
};

export default function BrandsPage() {
  const navigate = useNavigate();
  const { cars } = useQuote();

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
