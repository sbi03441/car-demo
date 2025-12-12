import express from 'express';
import {
  getFAQs,
  getFAQ,
  getAdminFAQs,
  createFAQController,
  updateFAQController,
  deleteFAQController
} from '../controllers/faqs.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

/**
 * GET /api/faqs
 * 모든 FAQ 조회 (또는 카테고리별 조회)
 * Query: category (optional)
 */
router.get('/', getFAQs);

/**
 * GET /api/faqs/:id
 * 특정 FAQ 조회
 */
router.get('/:id', getFAQ);

// ========================================
// 관리자 전용 라우트
// ========================================

/**
 * GET /api/faqs/admin/all
 * 모든 FAQ 조회 (관리자용 - 비활성화 포함)
 */
router.get('/admin/all', authenticateToken, requireAdmin, getAdminFAQs);

/**
 * POST /api/faqs/admin
 * FAQ 생성 (관리자)
 */
router.post('/admin', authenticateToken, requireAdmin, createFAQController);

/**
 * PUT /api/faqs/admin/:id
 * FAQ 수정 (관리자)
 */
router.put('/admin/:id', authenticateToken, requireAdmin, updateFAQController);

/**
 * DELETE /api/faqs/admin/:id
 * FAQ 삭제 (관리자)
 */
router.delete('/admin/:id', authenticateToken, requireAdmin, deleteFAQController);

export default router;
