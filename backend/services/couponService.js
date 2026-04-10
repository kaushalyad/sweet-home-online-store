import couponModel from "../models/couponModel.js";

/**
 * @param {object} coupon — mongoose doc or plain object
 * @param {number} subtotal — cart subtotal (items only)
 * @param {number} deliveryFee
 * @returns {number} discount in INR (not rounded)
 */
export function computeCouponDiscount(coupon, subtotal, deliveryFee) {
  const sub = Number(subtotal) || 0;
  const fee = Number(deliveryFee) || 0;
  const type = coupon.type;
  const value = Number(coupon.value) || 0;

  if (type === "flat") {
    return Math.min(value, sub);
  }
  if (type === "percent") {
    const raw = (sub * value) / 100;
    const cap =
      coupon.maxDiscount != null && coupon.maxDiscount !== ""
        ? Number(coupon.maxDiscount)
        : Infinity;
    return Math.min(raw, cap, sub);
  }
  if (type === "shipping") {
    return Math.min(value, fee);
  }
  return 0;
}

/**
 * Server-side validation for checkout (COD / Razorpay).
 * @returns {{ ok: false } | { ok: true, discountAmount: number, coupon: { id, code, type, value } }}
 */
export async function validateAndComputeCoupon({
  code,
  subtotal,
  deliveryFee = 0,
}) {
  if (!code || String(code).trim() === "") {
    return { ok: false };
  }

  const normalized = String(code).trim().toUpperCase();
  const coupon = await couponModel.findOne({
    code: normalized,
    active: true,
  });

  if (!coupon) {
    return { ok: false };
  }

  const now = new Date();
  if (coupon.validFrom && now < coupon.validFrom) {
    return { ok: false };
  }
  if (coupon.validUntil && now > coupon.validUntil) {
    return { ok: false };
  }
  if (
    coupon.usageLimit != null &&
    Number(coupon.usedCount) >= Number(coupon.usageLimit)
  ) {
    return { ok: false };
  }

  const min = Number(coupon.minOrderAmount) || 0;
  const sub = Number(subtotal) || 0;
  if (sub < min) {
    return { ok: false };
  }

  const rawDiscount = computeCouponDiscount(coupon, subtotal, deliveryFee);
  if (rawDiscount <= 0) {
    return { ok: false };
  }

  const discountAmount = Math.round(rawDiscount * 100) / 100;

  return {
    ok: true,
    discountAmount,
    coupon: {
      id: coupon._id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    },
  };
}
