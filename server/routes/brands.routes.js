import express from 'express';
import {
  getBrand,
  getBrandByIdController,
  getAdminBrands,
  createBrandController,
  updateBrandController,
  deleteBrandController
} from '../controllers/brands.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

/**
 * GET /api/brands
 * 브랜드 정보 조회
 */
router.get('/', getBrand);

/**
 * GET /api/brands/:id
 * 특정 브랜드 조회
 */
router.get('/:id', getBrandByIdController);

// ========================================
// 관리자 전용 라우트
// ========================================

/**
 * GET /api/brands/admin/all
 * 모든 브랜드 조회 (관리자용)
 */
router.get('/admin/all', authenticateToken, requireAdmin, getAdminBrands);

/**
 * POST /api/brands/admin
 * 브랜드 생성 (관리자)
 */
router.post('/admin', authenticateToken, requireAdmin, createBrandController);

/**
 * PUT /api/brands/admin/:id
 * 브랜드 수정 (관리자)
 */
router.put('/admin/:id', authenticateToken, requireAdmin, updateBrandController);

/**
 * DELETE /api/brands/admin/:id
 * 브랜드 삭제 (관리자)
 */
router.delete('/admin/:id', authenticateToken, requireAdmin, deleteBrandController);

export default router;
