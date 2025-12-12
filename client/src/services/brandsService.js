import api from './api';

/**
 * 브랜드 정보 조회
 */
export const getBrandInfo = async () => {
  const response = await api.get('/brands');
  return response.data;
};

/**
 * 특정 브랜드 조회
 * @param {number} id - 브랜드 ID
 */
export const getBrandById = async (id) => {
  const response = await api.get(`/brands/${id}`);
  return response.data;
};
