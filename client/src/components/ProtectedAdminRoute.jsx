import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 관리자가 아닌 경우
  if (!user.isAdmin) {
    alert('관리자 권한이 필요합니다.');
    return <Navigate to="/" replace />;
  }

  return children;
}
