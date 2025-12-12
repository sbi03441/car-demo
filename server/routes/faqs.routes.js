import express from 'express';
import { getFAQs, getFAQ } from '../controllers/faqs.controller.js';

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

export default router;
