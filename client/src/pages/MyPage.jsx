import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

export default function MyPage() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const result = await deleteAccount();
      if (result.success) {
        alert('계정이 삭제되었습니다.');
        navigate('/');
      } else {
        alert(result.message || '계정 삭제에 실패했습니다.');
      }
    } catch (error) {
      alert('계정 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="mypage-page">
      <div className="mypage-container">
        <div className="mypage-header">
          <h1>마이페이지</h1>
          <p>회원 정보를 확인하세요</p>
        </div>

        <div className="mypage-content">
          <div className="info-section">
            <h2>기본 정보</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>이름</label>
                <div className="info-value">{user?.name || user?.NAME || '-'}</div>
              </div>
              <div className="info-item">
                <label>이메일</label>
                <div className="info-value">{user?.email || user?.EMAIL || '-'}</div>
              </div>
              <div className="info-item">
                <label>계정 유형</label>
                <div className="info-value">
                  {user?.isAdmin === 1 ? '관리자' : '일반 사용자'}
                </div>
              </div>
            </div>
          </div>

          <div className="action-section">
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
            <button className="delete-account-btn" onClick={handleDeleteAccount}>
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
