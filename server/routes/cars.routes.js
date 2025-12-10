import express from 'express';
import { getCars, getCar, getColors, getOptions } from '../controllers/cars.controller.js';

const router = express.Router();

/**
 * GET /api/cars
 * 모든 차량 조회
 */
router.get('/', getCars);

/**
 * GET /api/cars/:id
 * 특정 차량 조회
 */
router.get('/:id', getCar);

/**
 * GET /api/cars/colors
 * 모든 색상 조회
 */
router.get('/data/colors', getColors);

/**
 * GET /api/cars/options
 * 모든 옵션 조회
 */
router.get('/data/options', getOptions);

export default router;
