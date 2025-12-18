import { useState, useEffect } from 'react';
import {
  getAdminColors,
  createColor,
  updateColor,
  deleteColor,
  getAdminOptions,
  createOption,
  updateOption,
  deleteOption
} from '../services/adminService';
import './AdminColorOptionPage.css';

export default function AdminColorOptionPage() {
  const [activeTab, setActiveTab] = useState('colors'); // 'colors' or 'options'

  // 색상 관련 상태
  const [colors, setColors] = useState([]);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [editingColorId, setEditingColorId] = useState(null);
  const [colorFormData, setColorFormData] = useState({
    code: '',
    name: '',
    hex: '',
    price: ''
  });

  // 옵션 관련 상태
  const [options, setOptions] = useState([]);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState(null);
  const [optionFormData, setOptionFormData] = useState({
    code: '',
    name: '',
    price: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [colorsResponse, optionsResponse] = await Promise.all([
        getAdminColors(),
        getAdminOptions()
      ]);
      setColors(colorsResponse.data);
      setOptions(optionsResponse.data);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 색상 관리 함수
  // ========================================

  const handleOpenColorModal = (color = null) => {
    if (color) {
      setEditingColorId(color.ID);
      setColorFormData({
        code: color.CODE || '',
        name: color.NAME || '',
        hex: color.HEX || '',
        price: color.PRICE || 0
      });
    } else {
      setEditingColorId(null);
      setColorFormData({
        code: '',
        name: '',
        hex: '',
        price: ''
      });
    }
    setIsColorModalOpen(true);
  };

  const handleCloseColorModal = () => {
    setIsColorModalOpen(false);
    setEditingColorId(null);
    setColorFormData({
      code: '',
      name: '',
      hex: '',
      price: ''
    });
  };

  const handleColorSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...colorFormData,
        price: Number(colorFormData.price) || 0
      };

      if (editingColorId) {
        await updateColor(editingColorId, data);
        alert('색상이 수정되었습니다.');
      } else {
        await createColor(data);
        alert('색상이 생성되었습니다.');
      }
      handleCloseColorModal();
      loadData();
    } catch (error) {
      console.error('색상 저장 실패:', error);
      alert(editingColorId ? '색상 수정에 실패했습니다.' : '색상 생성에 실패했습니다.');
    }
  };

  const handleDeleteColor = async (id, name) => {
    if (!window.confirm(`"${name}" 색상을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteColor(id);
      alert('색상이 삭제되었습니다.');
      loadData();
    } catch (error) {
      console.error('색상 삭제 실패:', error);
      alert('색상 삭제에 실패했습니다.');
    }
  };

  // ========================================
  // 옵션 관리 함수
  // ========================================

  const handleOpenOptionModal = (option = null) => {
    if (option) {
      setEditingOptionId(option.ID);
      setOptionFormData({
        code: option.CODE || '',
        name: option.NAME || '',
        price: option.PRICE || 0
      });
    } else {
      setEditingOptionId(null);
      setOptionFormData({
        code: '',
        name: '',
        price: ''
      });
    }
    setIsOptionModalOpen(true);
  };

  const handleCloseOptionModal = () => {
    setIsOptionModalOpen(false);
    setEditingOptionId(null);
    setOptionFormData({
      code: '',
      name: '',
      price: ''
    });
  };

  const handleOptionSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...optionFormData,
        price: Number(optionFormData.price) || 0
      };

      if (editingOptionId) {
        await updateOption(editingOptionId, data);
        alert('옵션이 수정되었습니다.');
      } else {
        await createOption(data);
        alert('옵션이 생성되었습니다.');
      }
      handleCloseOptionModal();
      loadData();
    } catch (error) {
      console.error('옵션 저장 실패:', error);
      alert(editingOptionId ? '옵션 수정에 실패했습니다.' : '옵션 생성에 실패했습니다.');
    }
  };

  const handleDeleteOption = async (id, name) => {
    if (!window.confirm(`"${name}" 옵션을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteOption(id);
      alert('옵션이 삭제되었습니다.');
      loadData();
    } catch (error) {
      console.error('옵션 삭제 실패:', error);
      alert('옵션 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="admin-color-option-page">로딩 중...</div>;
  }

  return (
    <div className="admin-color-option-page">
      <div className="page-header">
        <h1>색상 / 옵션 관리</h1>
      </div>

      {/* 탭 메뉴 */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'colors' ? 'active' : ''}`}
          onClick={() => setActiveTab('colors')}
        >
          색상 관리
        </button>
        <button
          className={`tab ${activeTab === 'options' ? 'active' : ''}`}
          onClick={() => setActiveTab('options')}
        >
          옵션 관리
        </button>
      </div>

      {/* 색상 관리 섹션 */}
      {activeTab === 'colors' && (
        <div className="tab-content">
          <div className="content-header">
            <h2>색상 목록</h2>
            <button className="btn-create" onClick={() => handleOpenColorModal()}>
              + 색상 추가
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>코드</th>
                  <th>이름</th>
                  <th>색상</th>
                  <th>가격</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {colors.map((color) => (
                  <tr key={color.ID}>
                    <td>{color.ID}</td>
                    <td>{color.CODE}</td>
                    <td>{color.NAME}</td>
                    <td>
                      <div className="color-preview">
                        <div
                          className="color-box"
                          style={{ backgroundColor: color.HEX }}
                        ></div>
                        <span>{color.HEX}</span>
                      </div>
                    </td>
                    <td>{Number(color.PRICE).toLocaleString()}원</td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenColorModal(color)}
                      >
                        수정
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteColor(color.ID, color.NAME)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 옵션 관리 섹션 */}
      {activeTab === 'options' && (
        <div className="tab-content">
          <div className="content-header">
            <h2>옵션 목록</h2>
            <button className="btn-create" onClick={() => handleOpenOptionModal()}>
              + 옵션 추가
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>코드</th>
                  <th>이름</th>
                  <th>가격</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {options.map((option) => (
                  <tr key={option.ID}>
                    <td>{option.ID}</td>
                    <td>{option.CODE}</td>
                    <td>{option.NAME}</td>
                    <td>{Number(option.PRICE).toLocaleString()}원</td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenOptionModal(option)}
                      >
                        수정
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteOption(option.ID, option.NAME)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 색상 모달 */}
      {isColorModalOpen && (
        <div className="modal-overlay" onClick={handleCloseColorModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingColorId ? '색상 수정' : '색상 추가'}</h2>
            <form onSubmit={handleColorSubmit}>
              <div className="form-group">
                <label>코드 *</label>
                <input
                  type="text"
                  value={colorFormData.code}
                  onChange={(e) => setColorFormData({ ...colorFormData, code: e.target.value })}
                  required
                  placeholder="WH"
                />
              </div>

              <div className="form-group">
                <label>이름 *</label>
                <input
                  type="text"
                  value={colorFormData.name}
                  onChange={(e) => setColorFormData({ ...colorFormData, name: e.target.value })}
                  required
                  placeholder="화이트 펄"
                />
              </div>

              <div className="form-group">
                <label>색상 코드 (HEX) *</label>
                <div className="color-input-group">
                  <input
                    type="text"
                    value={colorFormData.hex}
                    onChange={(e) => {
                      let value = e.target.value.trim();
                      // #이 없으면 자동으로 추가
                      if (value && !value.startsWith('#')) {
                        value = '#' + value;
                      }
                      setColorFormData({ ...colorFormData, hex: value });
                    }}
                    required
                    placeholder="#FFFFFF"
                    maxLength="7"
                  />
                  <div
                    className="color-preview-box"
                    style={{
                      backgroundColor: colorFormData.hex || '#FFFFFF',
                      border: '2px solid #dee2e6'
                    }}
                    title={colorFormData.hex || '색상 미리보기'}
                  />
                  <input
                    type="color"
                    value={colorFormData.hex || '#FFFFFF'}
                    onChange={(e) => setColorFormData({ ...colorFormData, hex: e.target.value })}
                    className="color-picker"
                    title="색상 선택"
                  />
                </div>
                <small className="helper-text">
                  직접 입력하거나 색상 선택 버튼을 클릭하세요 (예: #FF5733)
                </small>
              </div>

              <div className="form-group">
                <label>가격</label>
                <input
                  type="number"
                  value={colorFormData.price}
                  onChange={(e) => setColorFormData({ ...colorFormData, price: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseColorModal}>
                  취소
                </button>
                <button type="submit" className="btn-submit">
                  {editingColorId ? '수정' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 옵션 모달 */}
      {isOptionModalOpen && (
        <div className="modal-overlay" onClick={handleCloseOptionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingOptionId ? '옵션 수정' : '옵션 추가'}</h2>
            <form onSubmit={handleOptionSubmit}>
              <div className="form-group">
                <label>코드 *</label>
                <input
                  type="text"
                  value={optionFormData.code}
                  onChange={(e) => setOptionFormData({ ...optionFormData, code: e.target.value })}
                  required
                  placeholder="SUNROOF"
                />
              </div>

              <div className="form-group">
                <label>이름 *</label>
                <input
                  type="text"
                  value={optionFormData.name}
                  onChange={(e) => setOptionFormData({ ...optionFormData, name: e.target.value })}
                  required
                  placeholder="파노라마 선루프"
                />
              </div>

              <div className="form-group">
                <label>가격</label>
                <input
                  type="number"
                  value={optionFormData.price}
                  onChange={(e) => setOptionFormData({ ...optionFormData, price: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseOptionModal}>
                  취소
                </button>
                <button type="submit" className="btn-submit">
                  {editingOptionId ? '수정' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
