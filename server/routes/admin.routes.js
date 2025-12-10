import express from 'express';
import {
  addCar,
  editCar,
  removeCar,
  addColor,
  editColor,
  removeColor,
  addOption,
  editOption,
  removeOption,
  getQuotes,
  getUsers,
  removeUser
} from '../controllers/admin.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

// 모든 관리자 라우트는 인증 + 관리자 권한 필요
router.use(authenticateToken, requireAdmin);

// ========== 차량 관리 ==========

/**
 * POST /api/admin/cars
 * 차량 생성
 */
router.post('/cars', addCar);

/**
 * PUT /api/admin/cars/:id
 * 차량 수정
 */
router.put('/cars/:id', editCar);

/**
 * DELETE /api/admin/cars/:id
 * 차량 삭제
 */
router.delete('/cars/:id', removeCar);

// ========== 색상 관리 ==========

/**
 * POST /api/admin/colors
 * 색상 생성
 */
router.post('/colors', addColor);

/**
 * PUT /api/admin/colors/:id
 * 색상 수정
 */
router.put('/colors/:id', editColor);

/**
 * DELETE /api/admin/colors/:id
 * 색상 삭제
 */
router.delete('/colors/:id', removeColor);

// ========== 옵션 관리 ==========

/**
 * POST /api/admin/options
 * 옵션 생성
 */
router.post('/options', addOption);

/**
 * PUT /api/admin/options/:id
 * 옵션 수정
 */
router.put('/options/:id', editOption);

/**
 * DELETE /api/admin/options/:id
 * 옵션 삭제
 */
router.delete('/options/:id', removeOption);

// ========== 견적 관리 ==========

/**
 * GET /api/admin/quotes
 * 모든 견적 조회
 */
router.get('/quotes', getQuotes);

// ========== 사용자 관리 ==========

/**
 * GET /api/admin/users
 * 모든 사용자 조회
 */
router.get('/users', getUsers);

/**
 * DELETE /api/admin/users/:id
 * 사용자 삭제
 */
router.delete('/users/:id', removeUser);

export default router;
