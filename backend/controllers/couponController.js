import logger from '../config/logger.js';
import { getActiveCoupons, validateAndComputeCoupon } from '../services/couponService.js';

export async function listActiveCoupons(req, res) {
  try {
    const coupons = await getActiveCoupons();
    res.json({ success: true, coupons });
  } catch (e) {
    logger.error(`listActiveCoupons error: ${e?.message || e}`);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
}

export async function applyCoupon(req, res) {
  try {
    const { code, subtotal, deliveryFee } = req.body || {};
    const result = await validateAndComputeCoupon({ code, subtotal, deliveryFee });
    if (!result.ok) {
      return res.status(result.status).json({ success: false, message: result.message });
    }
    return res.json({
      success: true,
      coupon: result.coupon,
      discountAmount: result.discountAmount
    });
  } catch (e) {
    logger.error(`applyCoupon error: ${e?.message || e}`);
    return res.status(500).json({ success: false, message: 'Failed to apply coupon' });
  }
}

