import express from "express";
import couponModel from "../models/couponModel.js";
import { validateAndComputeCoupon } from "../services/couponService.js";

const router = express.Router();

router.get("/active", async (req, res) => {
  try {
    const now = new Date();
    const coupons = await couponModel
      .find({ active: true })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    const active = coupons.filter((c) => {
      if (c.validFrom && new Date(c.validFrom) > now) return false;
      if (c.validUntil && new Date(c.validUntil) < now) return false;
      if (
        c.usageLimit != null &&
        Number(c.usedCount) >= Number(c.usageLimit)
      ) {
        return false;
      }
      return true;
    });

    res.json({ success: true, coupons: active });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post("/apply", async (req, res) => {
  try {
    const { code, subtotal, deliveryFee } = req.body;
    const r = await validateAndComputeCoupon({
      code,
      subtotal,
      deliveryFee: deliveryFee ?? 0,
    });

    if (!r.ok) {
      return res.status(400).json({
        success: false,
        message: "Invalid, expired, or not applicable for this order",
      });
    }

    res.json({
      success: true,
      discountAmount: r.discountAmount,
      coupon: r.coupon,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
