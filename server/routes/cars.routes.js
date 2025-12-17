import express from 'express';
import {
  getCars,
  getCar,
  getColors,
  getOptions,
  createCarController,
  updateCarController,
  deleteCarController
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
 * GET /api/cars/:id
 * 특정 차량 조회
 */
router.get('/:id', getCar);

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

export default router;
