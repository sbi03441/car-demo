import api from './api';

/**
 * 모든 FAQ 조회
 */
export const getAllFAQs = async () => {
  const response = await api.get('/faqs');
  return response.data;
};

/**
 * 카테고리별 FAQ 조회
 * @param {string} category - 카테고리명
 */
export const getFAQsByCategory = async (category) => {
  const response = await api.get(`/faqs?category=${category}`);
  return response.data;
};

/**
 * 특정 FAQ 조회
 * @param {number} id - FAQ ID
 */
export const getFAQById = async (id) => {
  const response = await api.get(`/faqs/${id}`);
  return response.data;
};
