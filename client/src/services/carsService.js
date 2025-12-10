import api from './api';

/**
 * 모든 차량 목록 조회
 */
export const getAllCars = async () => {
  const response = await api.get('/cars');
  return response.data;
};

/**
 * 특정 차량 상세 조회
 * @param {number} id - 차량 ID
 */
export const getCarById = async (id) => {
  const response = await api.get(`/cars/${id}`);
  return response.data;
};

/**
 * 모든 색상 옵션 조회
 */
export const getAllColors = async () => {
  const response = await api.get('/cars/data/colors');
  return response.data;
};

/**
 * 모든 추가 옵션 조회
 */
export const getAllOptions = async () => {
  const response = await api.get('/cars/data/options');
  return response.data;
};
