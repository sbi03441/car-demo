// src/pages/ModelPage.jsx
import { useNavigate } from "react-router-dom";
import { useQuote } from "../state/QuoteContext";

function CarCard({ car, selected, onClick, onDetailClick }) {
  return (
    <div className={`car-card ${selected ? "selected" : ""}`} tabIndex={0}>
      <img src={car.image} alt={car.name} />
      <h3>{car.brand} {car.name}</h3>
      <div className="car-price">{car.basePrice.toLocaleString()}원~</div>
      <div className="car-actions">
        <button className="detail-button" onClick={(e) => {
          e.stopPropagation();
          onDetailClick();
        }}>
          상세보기
        </button>
        <button className="select-button" onClick={onClick}>
          선택하기
        </button>
      </div>
    </div>
  );
}

export default function ModelPage() {
  const nav = useNavigate();
  const { cars, selectedCarId, setSelectedCarId, colors, setSelectedColorCode, setSelectedOptionCodes } = useQuote();

  const handleCarSelect = (carId) => {
    setSelectedCarId(carId);
    // 차량 선택 시 색상/옵션 초기화
    if (colors.length > 0) {
      setSelectedColorCode(colors[0].code); // 첫 번째 색상
    }
    setSelectedOptionCodes([]); // 옵션 전부 해제
    nav("/config");
  };

  const handleDetailView = (carId) => {
    nav(`/vehicles/${carId}`);
  };

  return (
    <section className="car-selection">
      <h2>차량 선택</h2>
      <div className="cars-grid">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            selected={selectedCarId === car.id}
            onClick={() => handleCarSelect(car.id)}
            onDetailClick={() => handleDetailView(car.id)}
          />
        ))}
      </div>
    </section>
  );
}
