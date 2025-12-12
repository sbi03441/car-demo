import { useState, useEffect } from "react";
import { getAdminFAQs, createFAQ, updateFAQ, deleteFAQ } from "../services/adminService";
import "./AdminFAQPage.css";

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    question: "",
    answer: "",
    displayOrder: 0,
    isActive: 1
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const response = await getAdminFAQs();
      if (response.success) {
        setFaqs(response.data);
      } else {
        setError('FAQ 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('FAQ 목록 조회 오류:', err);
      setError('FAQ 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setEditingFAQ(faq);
      setFormData({
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
        displayOrder: faq.displayOrder,
        isActive: faq.isActive
      });
    } else {
      setEditingFAQ(null);
      setFormData({
        category: "",
        question: "",
        answer: "",
        displayOrder: 0,
        isActive: 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFAQ(null);
    setFormData({
      category: "",
      question: "",
      answer: "",
      displayOrder: 0,
      isActive: 1
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingFAQ) {
        await updateFAQ(editingFAQ.id, formData);
        alert('FAQ가 수정되었습니다.');
      } else {
        await createFAQ(formData);
        alert('FAQ가 생성되었습니다.');
      }
      handleCloseModal();
      loadFAQs();
    } catch (err) {
      console.error('FAQ 저장 오류:', err);
      alert('FAQ 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 FAQ를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteFAQ(id);
      alert('FAQ가 삭제되었습니다.');
      loadFAQs();
    } catch (err) {
      console.error('FAQ 삭제 오류:', err);
      alert('FAQ 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="admin-faq-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-faq-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-faq-page">
      <div className="admin-header">
        <h1>FAQ 관리</h1>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          + FAQ 추가
        </button>
      </div>

      <div className="faq-table-container">
        <table className="faq-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>카테고리</th>
              <th>질문</th>
              <th>순서</th>
              <th>활성화</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td>{faq.id}</td>
                <td>{faq.category}</td>
                <td>{faq.question}</td>
                <td>{faq.displayOrder}</td>
                <td>
                  <span className={`status ${faq.isActive ? 'active' : 'inactive'}`}>
                    {faq.isActive ? '활성' : '비활성'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleOpenModal(faq)}
                  >
                    수정
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(faq.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingFAQ ? 'FAQ 수정' : 'FAQ 추가'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>카테고리</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>질문</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>답변</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows="5"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>순서</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>활성화</label>
                  <select
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: parseInt(e.target.value) })}
                  >
                    <option value={1}>활성</option>
                    <option value={0}>비활성</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  취소
                </button>
                <button type="submit" className="btn-submit">
                  {editingFAQ ? '수정' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
