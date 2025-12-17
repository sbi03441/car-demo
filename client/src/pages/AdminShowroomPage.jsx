import { useState, useEffect } from 'react';
import {
  getAdminShowrooms,
  createShowroom,
  updateShowroom,
  deleteShowroom
} from '../services/adminService';
import './AdminShowroomPage.css';

export default function AdminShowroomPage() {
  const [showrooms, setShowrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    hours: '',
    services: '',
    imageUrl: '',
    region: ''
  });

  const [hoursData, setHoursData] = useState({
    weekdayStart: '09:00',
    weekdayEnd: '20:00',
    weekendStart: '10:00',
    weekendEnd: '18:00',
    hasWeekend: true
  });

  useEffect(() => {
    loadShowrooms();
  }, []);

  const loadShowrooms = async () => {
    try {
      setLoading(true);
      const response = await getAdminShowrooms();
      setShowrooms(response.data);
    } catch (error) {
      console.error('전시장 목록 로드 실패:', error);
      alert('전시장 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (showroom = null) => {
    if (showroom) {
      setEditingId(showroom.id);

      // services를 쉼표로 구분된 문자열로 변환
      let servicesText = '';
      if (showroom.services) {
        try {
          const servicesArray = typeof showroom.services === 'string'
            ? JSON.parse(showroom.services)
            : showroom.services;
          servicesText = Array.isArray(servicesArray) ? servicesArray.join(', ') : showroom.services;
        } catch (e) {
          servicesText = showroom.services;
        }
      }

      // hours를 파싱하여 개별 필드로 분리
      if (showroom.hours) {
        const hoursMatch = showroom.hours.match(/평일\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2}),?\s*주말\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        if (hoursMatch) {
          setHoursData({
            weekdayStart: hoursMatch[1],
            weekdayEnd: hoursMatch[2],
            weekendStart: hoursMatch[3],
            weekendEnd: hoursMatch[4],
            hasWeekend: true
          });
        } else {
          // 주말 정보가 없는 경우 (평일만 운영)
          const weekdayMatch = showroom.hours.match(/평일\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
          if (weekdayMatch) {
            setHoursData({
              weekdayStart: weekdayMatch[1],
              weekdayEnd: weekdayMatch[2],
              weekendStart: '10:00',
              weekendEnd: '18:00',
              hasWeekend: false
            });
          }
        }
      }

      setFormData({
        name: showroom.name,
        address: showroom.address,
        phone: showroom.phone,
        hours: showroom.hours || '',
        services: servicesText,
        imageUrl: showroom.imageUrl || '',
        region: showroom.region
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        address: '',
        phone: '',
        hours: '',
        services: '',
        imageUrl: '',
        region: ''
      });
      setHoursData({
        weekdayStart: '09:00',
        weekdayEnd: '20:00',
        weekendStart: '10:00',
        weekendEnd: '18:00',
        hasWeekend: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      hours: '',
      services: '',
      imageUrl: '',
      region: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // services를 JSON 배열 문자열로 변환
      const servicesData = { ...formData };
      if (servicesData.services) {
        // 쉼표로 구분된 문자열을 배열로 변환 후 JSON 문자열로
        const servicesArray = servicesData.services
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        servicesData.services = JSON.stringify(servicesArray);
      } else {
        servicesData.services = '[]';
      }

      // hours를 형식에 맞게 조합
      if (hoursData.hasWeekend) {
        servicesData.hours = `평일 ${hoursData.weekdayStart} - ${hoursData.weekdayEnd}, 주말 ${hoursData.weekendStart} - ${hoursData.weekendEnd}`;
      } else {
        servicesData.hours = `평일 ${hoursData.weekdayStart} - ${hoursData.weekdayEnd}`;
      }

      if (editingId) {
        await updateShowroom(editingId, servicesData);
        alert('전시장이 수정되었습니다.');
      } else {
        await createShowroom(servicesData);
        alert('전시장이 생성되었습니다.');
      }
      handleCloseModal();
      loadShowrooms();
    } catch (error) {
      console.error('전시장 저장 실패:', error);
      alert(editingId ? '전시장 수정에 실패했습니다.' : '전시장 생성에 실패했습니다.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" 전시장을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteShowroom(id);
      alert('전시장이 삭제되었습니다.');
      loadShowrooms();
    } catch (error) {
      console.error('전시장 삭제 실패:', error);
      alert('전시장 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="admin-showroom-page">로딩 중...</div>;
  }

  return (
    <div className="admin-showroom-page">
      <div className="page-header">
        <h1>전시장 관리</h1>
        <button className="btn-create" onClick={() => handleOpenModal()}>
          + 전시장 추가
        </button>
      </div>

      <div className="showroom-table-container">
        <table className="showroom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>지역</th>
              <th>주소</th>
              <th>전화번호</th>
              <th>운영시간</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {showrooms.map((showroom) => (
              <tr key={showroom.id}>
                <td>{showroom.id}</td>
                <td>{showroom.name}</td>
                <td>{showroom.region}</td>
                <td>{showroom.address}</td>
                <td>{showroom.phone}</td>
                <td>{showroom.hours || '-'}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleOpenModal(showroom)}
                  >
                    수정
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(showroom.id, showroom.name)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? '전시장 수정' : '전시장 추가'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>지역 *</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="예: 서울, 경기, 부산"
                  required
                />
              </div>

              <div className="form-group">
                <label>주소 *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>전화번호 *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="예: 02-1234-5678"
                  required
                />
              </div>

              <div className="form-group">
                <label>운영시간</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '6px', display: 'block' }}>
                      평일 시작
                    </label>
                    <input
                      type="time"
                      value={hoursData.weekdayStart}
                      onChange={(e) => setHoursData({ ...hoursData, weekdayStart: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#666', marginBottom: '6px', display: 'block' }}>
                      평일 종료
                    </label>
                    <input
                      type="time"
                      value={hoursData.weekdayEnd}
                      onChange={(e) => setHoursData({ ...hoursData, weekdayEnd: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={hoursData.hasWeekend}
                      onChange={(e) => setHoursData({ ...hoursData, hasWeekend: e.target.checked })}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>주말 운영</span>
                  </label>
                </div>

                {hoursData.hasWeekend && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '13px', color: '#666', marginBottom: '6px', display: 'block' }}>
                        주말 시작
                      </label>
                      <input
                        type="time"
                        value={hoursData.weekendStart}
                        onChange={(e) => setHoursData({ ...hoursData, weekendStart: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', color: '#666', marginBottom: '6px', display: 'block' }}>
                        주말 종료
                      </label>
                      <input
                        type="time"
                        value={hoursData.weekendEnd}
                        onChange={(e) => setHoursData({ ...hoursData, weekendEnd: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '8px', display: 'block' }}>
                  * 저장 시 "{hoursData.hasWeekend
                    ? `평일 ${hoursData.weekdayStart} - ${hoursData.weekdayEnd}, 주말 ${hoursData.weekendStart} - ${hoursData.weekendEnd}`
                    : `평일 ${hoursData.weekdayStart} - ${hoursData.weekdayEnd}`
                  }" 형식으로 저장됩니다
                </small>
              </div>

              <div className="form-group">
                <label>서비스</label>
                <input
                  type="text"
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  placeholder="쉼표로 구분하여 입력하세요. 예: 시승 예약, 구매 상담, 정비 서비스"
                />
                <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  * 쉼표(,)로 구분하여 여러 서비스를 입력할 수 있습니다
                </small>
              </div>

              <div className="form-group">
                <label>이미지 URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  취소
                </button>
                <button type="submit" className="btn-submit">
                  {editingId ? '수정' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
