import { useParams, useNavigate } from "react-router-dom";
import { useQuote } from "../state/QuoteContext";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, setSelectedCarId } = useQuote();

  const car = cars.find(c => c.id === parseInt(id));

  if (!car) {
    return (
      <div className="vehicle-detail">
        <h2>차량을 찾을 수 없습니다</h2>
        <button className="quote-button" onClick={() => navigate("/models")}>
          차량 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const handleQuoteStart = () => {
    setSelectedCarId(car.id);
    navigate("/config");
  };

  return (
    <div className="vehicle-detail">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
        <h1>{car.name}</h1>
      </div>

      <div className="detail-content">
        <div className="vehicle-image-section">
          <img src={car.image} alt={car.name} className="detail-image" />
          <div className="price-info">
            <span className="price-label">시작 가격</span>
            <span className="price-value">{car.basePrice.toLocaleString()}원</span>
          </div>
        </div>

        <div className="vehicle-info-section">
          <div className="description">
            <h2>차량 소개</h2>
            <p>{car.description}</p>
          </div>

          <div className="specifications">
            <h2>주요 제원</h2>
            <div className="spec-grid">
              <div className="spec-item">
                <span className="spec-label">브랜드</span>
                <span className="spec-value">{car.brand}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">엔진</span>
                <span className="spec-value">{car.engine}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">최고출력</span>
                <span className="spec-value">{car.power}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">연비</span>
                <span className="spec-value">{car.fuelEfficiency}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">안전등급</span>
                <span className="spec-value">{car.safetyRating}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">크기(L×W×H)</span>
                <span className="spec-value">{car.dimensions}</span>
              </div>
            </div>
          </div>

          <div className="features">
            <h2>주요 특징</h2>
            <ul className="features-list">
              {car.features.map((feature, index) => (
                <li key={index} className="feature-item">{feature}</li>
              ))}
            </ul>
          </div>

          <div className="action-buttons">
            <button className="quote-button primary" onClick={handleQuoteStart}>
              이 차량으로 견적내기
            </button>
            <button className="quote-button" onClick={() => navigate("/models")}>
              다른 차량 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}