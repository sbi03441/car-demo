import express from 'express';
import { saveQuote, getMyQuotes, getQuote, modifyQuote, removeQuote } from '../controllers/quotes.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

/**
 * POST /api/quotes
 * 견적 저장
 */
router.post(
  '/',
  optionalAuth,
  [
    body('carId').isInt().withMessage('차량 ID는 숫자여야 합니다'),
    body('colorCode').notEmpty().withMessage('색상을 선택해주세요'),
    body('subtotal').isFloat({ min: 0 }).withMessage('소계는 0 이상이어야 합니다'),
    body('total').isFloat({ min: 0 }).withMessage('총액은 0 이상이어야 합니다')
  ],
  saveQuote
);

/**
 * GET /api/quotes/my
 * 내 견적 목록 조회 (로그인 필요)
 */
router.get('/my', authenticateToken, getMyQuotes);

/**
 * GET /api/quotes/:id
 * 특정 견적 조회
 */
router.get('/:id', optionalAuth, getQuote);

/**
 * PUT /api/quotes/:id
 * 견적 수정 (로그인 필요)
 */
router.put(
  '/:id',
  authenticateToken,
  [
    body('carId').isInt().withMessage('차량 ID는 숫자여야 합니다'),
    body('colorCode').notEmpty().withMessage('색상을 선택해주세요'),
    body('subtotal').isFloat({ min: 0 }).withMessage('소계는 0 이상이어야 합니다'),
    body('total').isFloat({ min: 0 }).withMessage('총액은 0 이상이어야 합니다')
  ],
  modifyQuote
);

/**
 * DELETE /api/quotes/:id
 * 견적 삭제 (로그인 필요)
 */
router.delete('/:id', authenticateToken, removeQuote);

export default router;
