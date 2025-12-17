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

// ========================================
// 차량 관리
// ========================================

/**
 * 모든 차량 조회 (관리자용)
 */
export const getAdminCars = async () => {
  const response = await api.get('/cars');
  return response.data;
};

/**
 * 차량 생성
 */
export const createCar = async (carData) => {
  const response = await api.post('/cars/admin', carData);
  return response.data;
};

/**
 * 차량 수정
 */
export const updateCar = async (id, carData) => {
  const response = await api.put(`/cars/admin/${id}`, carData);
  return response.data;
};

/**
 * 차량 삭제
 */
export const deleteCar = async (id) => {
  const response = await api.delete(`/cars/admin/${id}`);
  return response.data;
};

// ========================================
// 브랜드 관리
// ========================================

/**
 * 모든 브랜드 조회 (관리자용)
 */
export const getAdminBrands = async () => {
  const response = await api.get('/brands/admin/all');
  return response.data;
};

/**
 * 브랜드 생성
 */
export const createBrand = async (brandData) => {
  const response = await api.post('/brands/admin', brandData);
  return response.data;
};

/**
 * 브랜드 수정
 */
export const updateBrand = async (id, brandData) => {
  const response = await api.put(`/brands/admin/${id}`, brandData);
  return response.data;
};

/**
 * 브랜드 삭제
 */
export const deleteBrand = async (id) => {
  const response = await api.delete(`/brands/admin/${id}`);
  return response.data;
};
