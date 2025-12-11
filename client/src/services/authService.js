import api from './api';

/**
 * 회원가입
 * @param {Object} userData - { email, password, name }
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);

  // 토큰과 사용자 정보 저장
  if (response.data.success) {
    const { token, user } = response.data.data;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24시간 후

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expiresAt', expiresAt.toString());
  }

  return response.data;
};

/**
 * 로그인
 * @param {Object} credentials - { email, password }
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);

  // 토큰과 사용자 정보 저장
  if (response.data.success) {
    const { token, user } = response.data.data;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24시간 후

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expiresAt', expiresAt.toString());
  }

  return response.data;
};

/**
 * 로그아웃
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('expiresAt');
};

/**
 * 현재 로그인한 사용자 정보 조회
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * 로컬 스토리지에서 사용자 정보 가져오기
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * 로그인 여부 확인
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('expiresAt');

  if (!token || !expiresAt) {
    return false;
  }

  // 만료 시간 체크
  if (Date.now() > parseInt(expiresAt)) {
    // 만료됨 - 자동 로그아웃
    logout();
    return false;
  }

  return true;
};

/**
 * 관리자 여부 확인
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.isAdmin === 1;
};

/**
 * 회원 탈퇴
 */
export const deleteAccount = async () => {
  const response = await api.delete('/auth/me');

  // 계정 삭제 성공 시 로컬 스토리지 정리
  if (response.data.success) {
    logout();
  }

  return response.data;
};
