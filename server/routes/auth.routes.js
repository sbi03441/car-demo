import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

/**
 * POST /api/auth/register
 * 회원가입
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('유효한 이메일을 입력해주세요'),
    body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다'),
    body('name').notEmpty().withMessage('이름을 입력해주세요')
  ],
  register
);

/**
 * POST /api/auth/login
 * 로그인
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('유효한 이메일을 입력해주세요'),
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요')
  ],
  login
);

/**
 * GET /api/auth/me
 * 현재 로그인한 사용자 정보 조회
 */
router.get('/me', authenticateToken, getMe);

export default router;
