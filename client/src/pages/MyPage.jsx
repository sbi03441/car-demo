import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

export default function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
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
          </div>
        </div>
      </div>
    </div>
  );
}
