import express from 'express';
import {
  getShowrooms,
  getShowroom,
  createShowroomController,
  updateShowroomController,
  deleteShowroomController
} from '../controllers/showrooms.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

/**
 * GET /api/showrooms
 * 모든 전시장 조회 (또는 지역별 조회)
 * Query: region (optional)
 */
router.get('/', getShowrooms);

/**
 * GET /api/showrooms/:id
 * 특정 전시장 조회
 */
router.get('/:id', getShowroom);

// ========================================
// 관리자 전용 라우트
// ========================================

/**
 * POST /api/showrooms/admin
 * 전시장 생성 (관리자)
 */
router.post('/admin', authenticateToken, requireAdmin, createShowroomController);

/**
 * PUT /api/showrooms/admin/:id
 * 전시장 수정 (관리자)
 */
router.put('/admin/:id', authenticateToken, requireAdmin, updateShowroomController);

/**
 * DELETE /api/showrooms/admin/:id
 * 전시장 삭제 (관리자)
 */
router.delete('/admin/:id', authenticateToken, requireAdmin, deleteShowroomController);

export default router;
