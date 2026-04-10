import couponModel from "../models/couponModel.js";

export const adminListCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const adminCreateCoupon = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.code) {
      payload.code = String(payload.code).trim().toUpperCase();
    }
    const coupon = await couponModel.create(payload);
    res.status(201).json({ success: true, coupon });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const adminUpdateCoupon = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.code != null) {
      updates.code = String(updates.code).trim().toUpperCase();
    }
    const coupon = await couponModel.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    res.json({ success: true, coupon });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const adminDeleteCoupon = async (req, res) => {
  try {
    const coupon = await couponModel.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
