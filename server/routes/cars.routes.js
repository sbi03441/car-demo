import express from 'express';
import {
  getCars,
  getCar,
  getColors,
  getOptions,
  getAvailableCarColors,
  getAvailableCarOptions,
  createCarController,
  updateCarController,
  deleteCarController,
  createColorController,
  updateColorController,
  deleteColorController,
  createOptionController,
  updateOptionController,
  deleteOptionController,
  getCarColorsController,
  updateCarColorsController,
  getCarOptionsController,
  updateCarOptionsController
} from '../controllers/cars.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

/**
 * GET /api/cars
 * 모든 차량 조회
 */
router.get('/', getCars);

/**
 * GET /api/cars/colors
 * 모든 색상 조회
 */
router.get('/data/colors', getColors);

/**
 * GET /api/cars/options
 * 모든 옵션 조회
 */
router.get('/data/options', getOptions);

/**
 * GET /api/cars/:carId/available-colors
 * 특정 차량의 사용 가능한 색상 조회 (공개)
 */
router.get('/:carId/available-colors', getAvailableCarColors);

/**
 * GET /api/cars/:carId/available-options
 * 특정 차량의 사용 가능한 옵션 조회 (공개)
 */
router.get('/:carId/available-options', getAvailableCarOptions);

/**
 * GET /api/cars/:carId/colors
 * 특정 차량의 색상 목록 조회 (관리자)
 */
router.get('/:carId/colors', authenticateToken, requireAdmin, getCarColorsController);

/**
 * PUT /api/cars/:carId/colors
 * 차량의 색상 관계 업데이트 (관리자)
 */
router.put('/:carId/colors', authenticateToken, requireAdmin, updateCarColorsController);

/**
 * GET /api/cars/:carId/options
 * 특정 차량의 옵션 목록 조회 (관리자)
 */
router.get('/:carId/options', authenticateToken, requireAdmin, getCarOptionsController);

/**
 * PUT /api/cars/:carId/options
 * 차량의 옵션 관계 업데이트 (관리자)
 */
router.put('/:carId/options', authenticateToken, requireAdmin, updateCarOptionsController);

/**
 * GET /api/cars/:id
 * 특정 차량 조회
 */
router.get('/:id', getCar);

// ========================================
// 관리자 전용 라우트
// ========================================

/**
 * POST /api/cars/admin
 * 차량 생성 (관리자)
 */
router.post('/admin', authenticateToken, requireAdmin, createCarController);

/**
 * PUT /api/cars/admin/:id
 * 차량 수정 (관리자)
 */
router.put('/admin/:id', authenticateToken, requireAdmin, updateCarController);

/**
 * DELETE /api/cars/admin/:id
 * 차량 삭제 (관리자)
 */
router.delete('/admin/:id', authenticateToken, requireAdmin, deleteCarController);

/**
 * POST /api/cars/colors/admin
 * 색상 생성 (관리자)
 */
router.post('/colors/admin', authenticateToken, requireAdmin, createColorController);

/**
 * PUT /api/cars/colors/admin/:id
 * 색상 수정 (관리자)
 */
router.put('/colors/admin/:id', authenticateToken, requireAdmin, updateColorController);

/**
 * DELETE /api/cars/colors/admin/:id
 * 색상 삭제 (관리자)
 */
router.delete('/colors/admin/:id', authenticateToken, requireAdmin, deleteColorController);

/**
 * POST /api/cars/options/admin
 * 옵션 생성 (관리자)
 */
router.post('/options/admin', authenticateToken, requireAdmin, createOptionController);

/**
 * PUT /api/cars/options/admin/:id
 * 옵션 수정 (관리자)
 */
router.put('/options/admin/:id', authenticateToken, requireAdmin, updateOptionController);

/**
 * DELETE /api/cars/options/admin/:id
 * 옵션 삭제 (관리자)
 */
router.delete('/options/admin/:id', authenticateToken, requireAdmin, deleteOptionController);

export default router;
