import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, updateUser, deleteUser } from '../services/adminService';
import './AdminUserPage.css';

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 수정 모달 관련 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      console.log('받은 사용자 데이터:', response.data);
      if (response.data.length > 0) {
        console.log('첫 번째 사용자:', response.data[0]);
      }
      setUsers(response.data);
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error);
      alert('사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 사용자 정보 수정
  // ========================================

  const handleOpenEditModal = (user) => {
    setEditingUserId(user.ID);
    setEditFormData({
      name: user.NAME || '',
      email: user.EMAIL || ''
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUserId(null);
    setEditFormData({
      name: '',
      email: ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      alert('이름과 이메일은 필수입니다.');
      return;
    }

    try {
      await updateUser(editingUserId, {
        name: editFormData.name,
        email: editFormData.email
      });
      alert('사용자 정보가 수정되었습니다.');
      handleCloseEditModal();
      loadUsers();
    } catch (error) {
      console.error('사용자 정보 수정 실패:', error);
      alert(error.response?.data?.message || '사용자 정보 수정에 실패했습니다.');
    }
  };

  // ========================================
  // 관리자 권한 토글
  // ========================================

  const handleToggleAdmin = async (user) => {
    const newAdminStatus = user.isAdmin === 1 ? 0 : 1;
    const action = newAdminStatus === 1 ? '부여' : '해제';

    if (!window.confirm(`"${user.NAME}" 사용자에게 관리자 권한을 ${action}하시겠습니까?`)) {
      return;
    }

    try {
      await updateUserRole(user.ID, newAdminStatus);
      alert(`관리자 권한이 ${action}되었습니다.`);
      loadUsers();
    } catch (error) {
      console.error('관리자 권한 변경 실패:', error);
      alert(error.response?.data?.message || '관리자 권한 변경에 실패했습니다.');
    }
  };

  // ========================================
  // 사용자 삭제
  // ========================================

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`"${user.NAME}" 사용자를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await deleteUser(user.ID);
      alert('사용자가 삭제되었습니다.');
      loadUsers();
    } catch (error) {
      console.error('사용자 삭제 실패:', error);
      alert(error.response?.data?.message || '사용자 삭제에 실패했습니다.');
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';

    try {
      // Oracle 한글 형식: "2025/11/25 오후 15:00:14.335000"
      // ISO 형식이나 다른 형식도 처리
      const date = new Date(dateStr);

      if (isNaN(date.getTime())) {
        // Date 파싱 실패 시, Oracle 한글 형식 파싱
        const match = dateStr.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
        if (match) {
          const [_, year, month, day] = match;
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr; // 파싱 실패 시 원본 문자열 반환
      }

      return date.toLocaleDateString('ko-KR');
    } catch (error) {
      console.error('날짜 파싱 오류:', error, dateStr);
      return dateStr;
    }
  };

  if (loading) {
    return <div className="admin-user-page">로딩 중...</div>;
  }

  return (
    <div className="admin-user-page">
      <div className="page-header">
        <h1>사용자 관리</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이메일</th>
              <th>이름</th>
              <th>관리자</th>
              <th>가입일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.ID}>
                <td>{user.ID}</td>
                <td>{user.EMAIL}</td>
                <td>{user.NAME}</td>
                <td>
                  <span className={`badge ${user.isAdmin === 1 ? 'badge-admin' : 'badge-user'}`}>
                    {user.isAdmin === 1 ? '관리자' : '일반'}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleOpenEditModal(user)}
                  >
                    수정
                  </button>
                  <button
                    className={`btn-toggle-admin ${user.isAdmin === 1 ? 'btn-revoke' : 'btn-grant'}`}
                    onClick={() => handleToggleAdmin(user)}
                  >
                    {user.isAdmin === 1 ? '권한해제' : '권한부여'}
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteUser(user)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="empty-state">
            <p>등록된 사용자가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 사용자 정보 수정 모달 */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>사용자 정보 수정</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>이름 *</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  placeholder="홍길동"
                />
              </div>

              <div className="form-group">
                <label>이메일 *</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  required
                  placeholder="user@example.com"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseEditModal}>
                  취소
                </button>
                <button type="submit" className="btn-submit">
                  수정
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
