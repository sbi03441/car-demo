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
