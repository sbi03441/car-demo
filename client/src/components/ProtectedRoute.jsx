import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - 인증이 필요한 페이지를 보호하는 컴포넌트
 *
 * @param {Object} props
 * @param {ReactNode} props.children - 보호할 페이지 컴포넌트
 * @param {boolean} props.requireAdmin - 관리자 권한이 필요한 경우 true
 */
function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // 로딩 중일 때는 로딩 표시
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        로딩 중...
      </div>
    );
  }

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    // 로그인 후 원래 페이지로 돌아갈 수 있도록 현재 위치 저장
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 관리자 권한이 필요한데 관리자가 아닌 경우 홈으로 리다이렉트
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 인증 성공 - 자식 컴포넌트 렌더링
  return children;
}

export default ProtectedRoute;
