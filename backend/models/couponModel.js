import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['flat', 'percent', 'shipping'], required: true },
    value: { type: Number, required: true, min: 0 }, // flat amount or percent or shipping discount amount
    minOrderAmount: { type: Number, default: 0, min: 0 },
    maxDiscount: { type: Number, default: null }, // used for percent coupons
    expiresAt: { type: Date, default: null },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ active: 1, expiresAt: 1 });

const couponModel = mongoose.models.coupon || mongoose.model('coupon', couponSchema);

export default couponModel;

