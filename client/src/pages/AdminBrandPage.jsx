import { useState, useEffect } from 'react';
import {
  getAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand
} from '../services/adminService';
import './AdminBrandPage.css';

export default function AdminBrandPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    tagline: '',
    description: '',
    heritage: '',
    keyTech: '',
    philosophy: '',
    values: ''
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await getAdminBrands();
      setBrands(response.data);
    } catch (error) {
      console.error('브랜드 목록 로드 실패:', error);
      alert('브랜드 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (brand = null) => {
    if (brand) {
      setEditingId(brand.id);
      setFormData({
        name: brand.name,
        logo: brand.logo || '',
        tagline: brand.tagline || '',
        description: brand.description || '',
        heritage: brand.heritage || '',
        keyTech: brand.keyTech || '',
        philosophy: brand.philosophy || '',
        values: brand.values || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        logo: '',
        tagline: '',
        description: '',
        heritage: '',
        keyTech: '',
        philosophy: '',
        values: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      logo: '',
      tagline: '',
      description: '',
      heritage: '',
      keyTech: '',
      philosophy: '',
      values: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateBrand(editingId, formData);
        alert('브랜드가 수정되었습니다.');
      } else {
        await createBrand(formData);
        alert('브랜드가 생성되었습니다.');
      }
      handleCloseModal();
      loadBrands();
    } catch (error) {
      console.error('브랜드 저장 실패:', error);
      alert(editingId ? '브랜드 수정에 실패했습니다.' : '브랜드 생성에 실패했습니다.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" 브랜드를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteBrand(id);
      alert('브랜드가 삭제되었습니다.');
      loadBrands();
    } catch (error) {
      console.error('브랜드 삭제 실패:', error);
      alert('브랜드 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="admin-brand-page">로딩 중...</div>;
  }

  return (
    <div className="admin-brand-page">
      <div className="page-header">
        <h1>브랜드 관리</h1>
        <button className="btn-create" onClick={() => handleOpenModal()}>
          + 브랜드 추가
        </button>
      </div>

      <div className="brand-table-container">
        <table className="brand-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>태그라인</th>
              <th>철학</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>{brand.id}</td>
                <td>{brand.name}</td>
                <td>{brand.tagline || '-'}</td>
                <td>{brand.philosophy || '-'}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleOpenModal(brand)}
                  >
                    수정
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(brand.id, brand.name)}
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
            <h2>{editingId ? '브랜드 수정' : '브랜드 추가'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>브랜드 이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>로고 URL</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="form-group">
                <label>태그라인</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="예: 미래를 향한 혁신"
                />
              </div>

              <div className="form-group">
                <label>설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="브랜드에 대한 설명을 입력하세요"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>헤리티지</label>
                <textarea
                  value={formData.heritage}
                  onChange={(e) => setFormData({ ...formData, heritage: e.target.value })}
                  placeholder="브랜드의 역사와 전통을 입력하세요"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>핵심 기술</label>
                <textarea
                  value={formData.keyTech}
                  onChange={(e) => setFormData({ ...formData, keyTech: e.target.value })}
                  placeholder="브랜드의 핵심 기술을 입력하세요"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>철학</label>
                <textarea
                  value={formData.philosophy}
                  onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                  placeholder="브랜드 철학을 입력하세요"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>브랜드 가치</label>
                <textarea
                  value={formData.values}
                  onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                  placeholder="브랜드의 가치를 입력하세요"
                  rows="3"
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
