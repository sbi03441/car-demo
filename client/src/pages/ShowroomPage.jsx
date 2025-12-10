import { useState } from "react";

// 전시장 데이터
const showrooms = [
  {
    id: 1,
    name: "Car Demo 강남 전시장",
    address: "서울특별시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    hours: "평일 09:00 - 20:00, 주말 10:00 - 18:00",
    services: ["시승 예약", "구매 상담", "금융 상담", "정비 서비스"],
    image: "https://images.unsplash.com/photo-1562832135-14a35d25edef?w=800&h=600&fit=crop",
    region: "서울"
  },
  {
    id: 2,
    name: "Car Demo 판교 전시장",
    address: "경기도 성남시 분당구 판교역로 100",
    phone: "031-2345-6789",
    hours: "평일 09:00 - 20:00, 주말 10:00 - 18:00",
    services: ["시승 예약", "구매 상담", "금융 상담"],
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
    region: "경기"
  },
  {
    id: 3,
    name: "Car Demo 부산 전시장",
    address: "부산광역시 해운대구 센텀중앙로 78",
    phone: "051-3456-7890",
    hours: "평일 09:00 - 20:00, 주말 10:00 - 18:00",
    services: ["시승 예약", "구매 상담", "정비 서비스"],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    region: "부산"
  },
  {
    id: 4,
    name: "Car Demo 대구 전시장",
    address: "대구광역시 수성구 동대구로 456",
    phone: "053-4567-8901",
    hours: "평일 09:00 - 20:00, 주말 10:00 - 18:00",
    services: ["시승 예약", "구매 상담", "금융 상담", "정비 서비스"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    region: "대구"
  },
  {
    id: 5,
    name: "Car Demo 인천 전시장",
    address: "인천광역시 연수구 송도과학로 32",
    phone: "032-5678-9012",
    hours: "평일 09:00 - 20:00, 주말 10:00 - 18:00",
    services: ["시승 예약", "구매 상담"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    region: "인천"
  },
  {
    id: 6,
    name: "Car Demo 광주 전시장",
    address: "광주광역시 서구 상무대로 789",
    phone: "062-6789-0123",
    hours: "평일 09:00 - 20:00, 주말 10:00 - 18:00",
    services: ["시승 예약", "구매 상담", "금융 상담"],
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop",
    region: "광주"
  }
];

const regions = ["전체", "서울", "경기", "부산", "대구", "인천", "광주"];

export default function ShowroomPage() {
  const [selectedRegion, setSelectedRegion] = useState("전체");

  const filteredShowrooms = selectedRegion === "전체"
    ? showrooms
    : showrooms.filter(showroom => showroom.region === selectedRegion);

  return (
    <div className="showroom-page">
      {/* 헤더 */}
      <div className="showroom-header">
        <h1>전시장 찾기</h1>
        <p className="showroom-subtitle">가까운 Car Demo 전시장을 방문하여 차량을 직접 경험해보세요</p>
      </div>

      {/* 지역 필터 */}
      <div className="region-filter">
        <div className="filter-buttons">
          {regions.map((region) => (
            <button
              key={region}
              className={`filter-button ${selectedRegion === region ? "active" : ""}`}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* 전시장 목록 */}
      <div className="showrooms-grid">
        {filteredShowrooms.map((showroom) => (
          <div key={showroom.id} className="showroom-card">
            <div className="showroom-image">
              <img src={showroom.image} alt={showroom.name} />
              <div className="showroom-region-badge">{showroom.region}</div>
            </div>
            <div className="showroom-content">
              <h2>{showroom.name}</h2>

              <div className="showroom-info">
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <span className="info-text">{showroom.address}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">📞</span>
                  <span className="info-text">{showroom.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🕒</span>
                  <span className="info-text">{showroom.hours}</span>
                </div>
              </div>

              <div className="showroom-services">
                <h3>제공 서비스</h3>
                <div className="services-list">
                  {showroom.services.map((service, index) => (
                    <span key={index} className="service-tag">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="showroom-actions">
                <button className="contact-button">
                  문의하기
                </button>
                <button className="visit-button">
                  방문 예약
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 전시장이 없을 때 */}
      {filteredShowrooms.length === 0 && (
        <div className="no-showrooms">
          <p>해당 지역에 전시장이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
