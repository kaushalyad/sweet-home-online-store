import couponModel from '../models/couponModel.js';
import logger from '../config/logger.js';

export async function adminListCoupons(req, res) {
  try {
    const coupons = await couponModel.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, coupons });
  } catch (e) {
    logger.error(`adminListCoupons error: ${e?.message || e}`);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
}

export async function adminCreateCoupon(req, res) {
  try {
    const {
      code,
      type,
      value,
      minOrderAmount = 0,
      maxDiscount = null,
      expiresAt = null,
      active = true
    } = req.body || {};

    const cleanCode = String(code || '').trim().toUpperCase();
    if (!cleanCode) return res.status(400).json({ success: false, message: 'code is required' });
    if (!['flat', 'percent', 'shipping'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }

    const val = Number(value);
    if (Number.isNaN(val) || val < 0) {
      return res.status(400).json({ success: false, message: 'Invalid value' });
    }

    const doc = await couponModel.create({
      code: cleanCode,
      type,
      value: val,
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscount: maxDiscount === null || maxDiscount === undefined || maxDiscount === '' ? null : Number(maxDiscount),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      active: Boolean(active)
    });

    res.status(201).json({ success: true, coupon: doc });
  } catch (e) {
    const msg = e?.code === 11000 ? 'Coupon code already exists' : (e?.message || 'Failed to create coupon');
    logger.error(`adminCreateCoupon error: ${e?.message || e}`);
    res.status(500).json({ success: false, message: msg });
  }
}

export async function adminUpdateCoupon(req, res) {
  try {
    const { id } = req.params;
    const patch = { ...req.body };
    if (patch.code) patch.code = String(patch.code).trim().toUpperCase();
    if (patch.expiresAt === '') patch.expiresAt = null;

    const updated = await couponModel.findByIdAndUpdate(id, patch, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, coupon: updated });
  } catch (e) {
    logger.error(`adminUpdateCoupon error: ${e?.message || e}`);
    res.status(500).json({ success: false, message: 'Failed to update coupon' });
  }
}

export async function adminDeleteCoupon(req, res) {
  try {
    const { id } = req.params;
    const deleted = await couponModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (e) {
    logger.error(`adminDeleteCoupon error: ${e?.message || e}`);
    res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
}

