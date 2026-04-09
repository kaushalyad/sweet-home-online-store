import couponModel from '../models/couponModel.js';

export async function getActiveCoupons() {
  const now = new Date();
  return couponModel
    .find({
      active: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
    })
    .sort({ createdAt: -1 })
    .lean();
}

export async function validateAndComputeCoupon({ code, subtotal, deliveryFee }) {
  const cleanCode = String(code || '').trim().toUpperCase();
  if (!cleanCode) {
    return { ok: false, status: 400, message: 'Coupon code is required' };
  }

  const now = new Date();
  const coupon = await couponModel.findOne({
    code: cleanCode,
    active: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
  });

  if (!coupon) {
    return { ok: false, status: 404, message: 'Invalid or expired coupon code' };
  }

  const sub = Number(subtotal || 0);
  if (Number.isNaN(sub) || sub < 0) {
    return { ok: false, status: 400, message: 'Invalid subtotal' };
  }

  if (coupon.minOrderAmount && sub < coupon.minOrderAmount) {
    return {
      ok: false,
      status: 400,
      message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`
    };
  }

  let discountAmount = 0;
  if (coupon.type === 'flat') {
    discountAmount = Number(coupon.value || 0);
  } else if (coupon.type === 'percent') {
    discountAmount = (sub * Number(coupon.value || 0)) / 100;
    if (coupon.maxDiscount != null) {
      discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
    }
  } else if (coupon.type === 'shipping') {
    const fee = Number(deliveryFee || 0);
    discountAmount = Math.min(fee, Number(coupon.value || 0));
  }

  discountAmount = Math.max(0, Math.floor(discountAmount));

  return {
    ok: true,
    coupon: {
      id: coupon._id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscount: coupon.maxDiscount ?? null,
      expiresAt: coupon.expiresAt ?? null
    },
    discountAmount
  };
}

