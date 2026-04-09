import express from 'express';
import { applyCoupon, listActiveCoupons } from '../controllers/couponController.js';

const router = express.Router();

// Public: show available coupons (for checkout UI)
router.get('/active', listActiveCoupons);

// Public: compute discount server-side
router.post('/apply', applyCoupon);

export default router;

