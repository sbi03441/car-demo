import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

// Context 생성
const AuthContext = createContext(null);

// Custom Hook - useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 초기화: 페이지 로드 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = localStorage.getItem('token');
        const expiresAt = localStorage.getItem('expiresAt');

        // 만료 시간 체크
        if (expiresAt && Date.now() > parseInt(expiresAt)) {
          // 만료됨 - 자동 로그아웃
          authService.logout();
          setUser(null);
          return;
        }

        if (currentUser && token) {
          // 토큰 유효성 검증
          try {
            const response = await authService.getMe();
            if (response.success) {
              setUser(response.data);
            } else {
              // 토큰이 만료되었거나 유효하지 않음
              authService.logout();
              setUser(null);
            }
          } catch (err) {
            // 토큰 검증 실패
            console.error('토큰 검증 실패:', err);
            authService.logout();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('인증 초기화 실패:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 회원가입
  const register = async (email, password, name) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.register({ email, password, name });

      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.message || '회원가입에 실패했습니다.');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // 로그인
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.login({ email, password });

      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError(response.message || '로그인에 실패했습니다.');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  // Context 값
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin === 1,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
