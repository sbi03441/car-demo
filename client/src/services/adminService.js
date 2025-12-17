import api from './api';

// ========================================
// FAQ 관리
// ========================================

/**
 * 모든 FAQ 조회 (관리자용 - 비활성화 포함)
 */
export const getAdminFAQs = async () => {
  const response = await api.get('/faqs/admin/all');
  return response.data;
};

/**
 * FAQ 생성
 */
export const createFAQ = async (faqData) => {
  const response = await api.post('/faqs/admin', faqData);
  return response.data;
};

/**
 * FAQ 수정
 */
export const updateFAQ = async (id, faqData) => {
  const response = await api.put(`/faqs/admin/${id}`, faqData);
  return response.data;
};

/**
 * FAQ 삭제
 */
export const deleteFAQ = async (id) => {
  const response = await api.delete(`/faqs/admin/${id}`);
  return response.data;
};

// ========================================
// 전시장 관리
// ========================================

/**
 * 모든 전시장 조회 (관리자용)
 */
export const getAdminShowrooms = async () => {
  const response = await api.get('/showrooms');
  return response.data;
};

/**
 * 전시장 생성
 */
export const createShowroom = async (showroomData) => {
  const response = await api.post('/showrooms/admin', showroomData);
  return response.data;
};

/**
 * 전시장 수정
 */
export const updateShowroom = async (id, showroomData) => {
  const response = await api.put(`/showrooms/admin/${id}`, showroomData);
  return response.data;
};

/**
 * 전시장 삭제
 */
export const deleteShowroom = async (id) => {
  const response = await api.delete(`/showrooms/admin/${id}`);
  return response.data;
};
