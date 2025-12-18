import express from 'express';
import {
  getUsersController,
  updateUserRoleController,
  updateUserController,
  deleteUserController
} from '../controllers/users.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

/**
 * GET /api/users
 * 모든 사용자 조회 (관리자)
 */
router.get('/', authenticateToken, requireAdmin, getUsersController);

/**
 * PUT /api/users/:id/role
 * 사용자 역할 변경 (관리자)
 */
router.put('/:id/role', authenticateToken, requireAdmin, updateUserRoleController);

/**
 * PUT /api/users/:id
 * 사용자 정보 수정 (관리자)
 */
router.put('/:id', authenticateToken, requireAdmin, updateUserController);

/**
 * DELETE /api/users/:id
 * 사용자 삭제 (관리자)
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteUserController);

export default router;
