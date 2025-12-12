import api from './api';

/**
 * 모든 전시장 목록 조회
 */
export const getAllShowrooms = async () => {
  const response = await api.get('/showrooms');
  return response.data;
};

/**
 * 지역별 전시장 조회
 * @param {string} region - 지역명
 */
export const getShowroomsByRegion = async (region) => {
  const response = await api.get(`/showrooms?region=${region}`);
  return response.data;
};

/**
 * 특정 전시장 상세 조회
 * @param {number} id - 전시장 ID
 */
export const getShowroomById = async (id) => {
  const response = await api.get(`/showrooms/${id}`);
  return response.data;
};
