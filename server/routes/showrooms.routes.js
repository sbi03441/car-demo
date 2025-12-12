import express from 'express';
import { getShowrooms, getShowroom } from '../controllers/showrooms.controller.js';

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

export default router;
