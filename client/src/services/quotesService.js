import api from './api';

/**
 * 견적 저장
 * @param {Object} quoteData - 견적 데이터
 */
export const saveQuote = async (quoteData) => {
  const response = await api.post('/quotes', quoteData);
  return response.data;
};

/**
 * 내 견적 목록 조회 (로그인 필요)
 */
export const getMyQuotes = async () => {
  const response = await api.get('/quotes/my');
  return response.data;
};

/**
 * 특정 견적 조회
 * @param {number} id - 견적 ID
 */
export const getQuoteById = async (id) => {
  const response = await api.get(`/quotes/${id}`);
  return response.data;
};

/**
 * 견적 수정
 * @param {number} id - 견적 ID
 * @param {Object} quoteData - 수정할 견적 데이터
 */
export const updateQuote = async (id, quoteData) => {
  const response = await api.put(`/quotes/${id}`, quoteData);
  return response.data;
};

/**
 * 견적 삭제
 * @param {number} id - 견적 ID
 */
export const deleteQuote = async (id) => {
  const response = await api.delete(`/quotes/${id}`);
  return response.data;
};
