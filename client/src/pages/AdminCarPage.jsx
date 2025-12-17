import { useState, useEffect } from 'react';
import {
  getAdminCars,
  createCar,
  updateCar,
  deleteCar
} from '../services/adminService';
import './AdminCarPage.css';

export default function AdminCarPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    imageUrl: '',
    brand: '',
    engine: '',
    power: '',
    fuelEfficiency: '',
    safetyRating: '',
    dimensions: '',
    description: '',
    features: ''
  });

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const response = await getAdminCars();
      setCars(response.data);
    } catch (error) {
      console.error('차량 목록 로드 실패:', error);
      alert('차량 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (car = null) => {
    if (car) {
      setEditingId(car.ID);
      setFormData({
        name: car.NAME,
        basePrice: car.basePrice || '',
        imageUrl: car.image || '',
        brand: car.BRAND || '',
        engine: car.ENGINE || '',
        power: car.POWER || '',
        fuelEfficiency: car.fuelEfficiency || '',
        safetyRating: car.safetyRating || '',
        dimensions: car.DIMENSIONS || '',
        description: car.DESCRIPTION || '',
        features: Array.isArray(car.features) ? car.features.join(', ') : ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        basePrice: '',
        imageUrl: '',
        brand: '',
        engine: '',
        power: '',
        fuelEfficiency: '',
        safetyRating: '',
        dimensions: '',
        description: '',
        features: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      basePrice: '',
      imageUrl: '',
      brand: '',
      engine: '',
      power: '',
      fuelEfficiency: '',
      safetyRating: '',
      dimensions: '',
      description: '',
      features: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // features를 배열로 변환
      const featuresArray = formData.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const carData = {
        ...formData,
        basePrice: Number(formData.basePrice),
        features: featuresArray
      };

      if (editingId) {
        await updateCar(editingId, carData);
        alert('차량이 수정되었습니다.');
      } else {
        await createCar(carData);
        alert('차량이 생성되었습니다.');
      }
      handleCloseModal();
      loadCars();
    } catch (error) {
      console.error('차량 저장 실패:', error);
      alert(editingId ? '차량 수정에 실패했습니다.' : '차량 생성에 실패했습니다.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" 차량을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteCar(id);
      alert('차량이 삭제되었습니다.');
      loadCars();
    } catch (error) {
      console.error('차량 삭제 실패:', error);
      alert('차량 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="admin-car-page">로딩 중...</div>;
  }

  return (
    <div className="admin-car-page">
      <div className="page-header">
        <h1>차량 관리</h1>
        <button className="btn-create" onClick={() => handleOpenModal()}>
          + 차량 추가
        </button>
      </div>

      <div className="car-table-container">
        <table className="car-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>브랜드</th>
              <th>가격</th>
              <th>엔진</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.ID}>
                <td>{car.ID}</td>
                <td>{car.NAME}</td>
                <td>{car.BRAND || '-'}</td>
                <td>{car.basePrice?.toLocaleString()}원</td>
                <td>{car.ENGINE || '-'}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleOpenModal(car)}
                  >
                    수정
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(car.ID, car.NAME)}
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
            <h2>{editingId ? '차량 수정' : '차량 추가'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>차량 이름 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>가격 *</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    required
                    placeholder="30000000"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>브랜드</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="현대"
                  />
                </div>

                <div className="form-group">
                  <label>이미지 URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/car.jpg"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>엔진</label>
                  <input
                    type="text"
                    value={formData.engine}
                    onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                    placeholder="2.0 가솔린 터보"
                  />
                </div>

                <div className="form-group">
                  <label>출력</label>
                  <input
                    type="text"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                    placeholder="240hp"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>연비</label>
                  <input
                    type="text"
                    value={formData.fuelEfficiency}
                    onChange={(e) => setFormData({ ...formData, fuelEfficiency: e.target.value })}
                    placeholder="12.5 km/L"
                  />
                </div>

                <div className="form-group">
                  <label>안전 등급</label>
                  <input
                    type="text"
                    value={formData.safetyRating}
                    onChange={(e) => setFormData({ ...formData, safetyRating: e.target.value })}
                    placeholder="5성급"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>치수</label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="4,850 x 1,875 x 1,470 mm"
                />
              </div>

              <div className="form-group">
                <label>설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="차량에 대한 설명을 입력하세요"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>특징 (쉼표로 구분)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="스마트 크루즈 컨트롤, 후방 카메라, 블루투스"
                  rows="3"
                />
                <small className="helper-text">
                  예: 스마트 크루즈 컨트롤, 후방 카메라, 블루투스
                </small>
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
