import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import Order from "../models/order.js";
import logger from "../config/logger.js";

const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return null;
  }
};

export const listProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const pid = toObjectId(productId);
    if (!pid) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const product = await productModel
      .findById(pid)
      .select("reviews rating totalReviews")
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const reviews = Array.isArray(product.reviews) ? [...product.reviews] : [];
    reviews.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    const start = (page - 1) * limit;
    const slice = reviews.slice(start, start + limit);

    res.json({
      success: true,
      reviews: slice,
      rating: Number(product.rating || 0),
      totalReviews: Number(product.totalReviews || reviews.length),
    });
  } catch (e) {
    logger.error("listProductReviews:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;
    const { rating, comment = "", media = [] } = req.body;

    const pid = toObjectId(productId);
    const uid = toObjectId(userId);
    if (!pid || !uid) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      return res.status(400).json({ success: false, message: "Rating must be 1–5" });
    }

    const product = await productModel.findById(pid);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const existingIdx = product.reviews.findIndex(
      (rev) => rev.userId && String(rev.userId) === String(uid)
    );
    if (existingIdx !== -1) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    let verifiedPurchase = false;
    try {
      const userOrders = await Order.find({ userId: uid })
        .select("items paymentStatus payment")
        .lean();
      const pidStr = String(pid);
      for (const o of userOrders) {
        const paid =
          o.paymentStatus === "completed" || o.payment === true;
        if (!paid) continue;
        for (const it of o.items || []) {
          const p = it.product;
          const id =
            p && typeof p === "object" && p._id != null
              ? String(p._id)
              : String(p);
          if (id === pidStr) {
            verifiedPurchase = true;
            break;
          }
        }
        if (verifiedPurchase) break;
      }
    } catch {
      verifiedPurchase = false;
    }

    product.reviews.push({
      userId: uid,
      rating: r,
      comment: String(comment || "").slice(0, 5000),
      media: Array.isArray(media) ? media.slice(0, 6) : [],
      verifiedPurchase,
    });

    product.recalculateRating();
    await product.save();

    res.status(201).json({ success: true, message: "Review saved" });
  } catch (e) {
    logger.error("addProductReview:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};
