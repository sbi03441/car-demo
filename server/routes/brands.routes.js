import express from 'express';
import { getBrand, getBrandByIdController } from '../controllers/brands.controller.js';

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

export default router;
