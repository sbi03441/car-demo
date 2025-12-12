import { useState, useEffect } from "react";
import { getAllShowrooms } from "../services/showroomsService";

const regions = ["전체", "서울", "경기", "부산", "대구", "인천", "광주"];

export default function ShowroomPage() {
  const [showrooms, setShowrooms] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShowrooms = async () => {
      try {
        setLoading(true);
        const response = await getAllShowrooms();

        if (response.success) {
          // services 필드를 JSON 파싱하여 배열로 변환
          const parsedShowrooms = response.data.map(showroom => ({
            ...showroom,
            services: typeof showroom.services === 'string'
              ? JSON.parse(showroom.services)
              : showroom.services,
            image: showroom.imageUrl // imageUrl을 image로 매핑
          }));
          setShowrooms(parsedShowrooms);
        } else {
          setError('전시장 목록을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('전시장 목록 조회 오류:', err);
        setError('전시장 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchShowrooms();
  }, []);

  const filteredShowrooms = selectedRegion === "전체"
    ? showrooms
    : showrooms.filter(showroom => showroom.region === selectedRegion);

  if (loading) {
    return (
      <div className="showroom-page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>전시장 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="showroom-page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

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
