import mongoose from 'mongoose';
import productModel from '../models/productModel.js';
import Order from '../models/order.js';
import logger from '../config/logger.js';

function normalizeObjectId(id) {
  try {
    return new mongoose.Types.ObjectId(String(id));
  } catch {
    return null;
  }
}

async function hasDeliveredPurchase({ userId, productId }) {
  const userObjectId = normalizeObjectId(userId);
  const productObjectId = normalizeObjectId(productId);
  if (!userObjectId || !productObjectId) return false;

  const match = await Order.findOne({
    userId: userObjectId,
    // Status is not consistent across codepaths (e.g. "Delivered" vs "delivered").
    // Use case-insensitive match to avoid blocking legitimate reviews.
    status: { $regex: /^delivered$/i },
    $or: [
      { 'items.product': productObjectId },
      { 'items.product': String(productObjectId) },
      { 'items.product._id': productObjectId },
      { 'items.product._id': String(productObjectId) }
    ]
  }).select({ _id: 1 });

  return !!match;
}

export async function listProductReviews(req, res) {
  try {
    const { productId } = req.params;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
    const skip = (page - 1) * limit;

    const product = await productModel
      .findById(productId)
      .select({ reviews: 1, rating: 1, totalReviews: 1 })
      .populate({ path: 'reviews.userId', select: 'name' })
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const allReviews = Array.isArray(product.reviews) ? product.reviews : [];
    const sorted = [...allReviews].sort((a, b) => {
      const ad = new Date(a?.createdAt || 0).getTime();
      const bd = new Date(b?.createdAt || 0).getTime();
      return bd - ad;
    });

    const pageItems = sorted.slice(skip, skip + limit);

    return res.json({
      success: true,
      rating: product.rating || 0,
      totalReviews: product.totalReviews || allReviews.length,
      reviews: pageItems,
      pagination: {
        total: allReviews.length,
        page,
        limit,
        totalPages: Math.ceil(allReviews.length / limit)
      }
    });
  } catch (error) {
    logger.error(`listProductReviews error: ${error?.message || error}`);
    return res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
}

export async function upsertMyReview(req, res) {
  try {
    const { productId } = req.params;
    const { rating, comment = '', media = [] } = req.body || {};

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    const ratingNum = Number(rating);
    if (!ratingNum || Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const verifiedPurchase = await hasDeliveredPurchase({ userId, productId });
    if (!verifiedPurchase) {
      return res.status(403).json({
        success: false,
        message: 'You can only review products after delivery (verified purchase required).'
      });
    }

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const userObjectId = normalizeObjectId(userId);
    if (!userObjectId) return res.status(400).json({ success: false, message: 'Invalid user' });

    const safeMedia = Array.isArray(media)
      ? media
          .filter((m) => m && typeof m.url === 'string' && (m.type === 'image' || m.type === 'video'))
          .map((m) => ({
            url: m.url,
            type: m.type,
            publicId: typeof m.publicId === 'string' ? m.publicId : undefined
          }))
      : [];

    const idx = (product.reviews || []).findIndex((r) => String(r.userId) === String(userObjectId));
    if (idx >= 0) {
      product.reviews[idx].rating = ratingNum;
      product.reviews[idx].comment = String(comment || '');
      product.reviews[idx].media = safeMedia;
      product.reviews[idx].verifiedPurchase = true;
    } else {
      product.reviews.push({
        userId: userObjectId,
        rating: ratingNum,
        comment: String(comment || ''),
        media: safeMedia,
        verifiedPurchase: true
      });
    }

    product.recalculateRating();
    await product.save();

    return res.json({
      success: true,
      message: 'Review saved',
      rating: product.rating,
      totalReviews: product.totalReviews
    });
  } catch (error) {
    logger.error(`upsertMyReview error: ${error?.message || error}`);
    return res.status(500).json({ success: false, message: 'Failed to save review' });
  }
}

export async function deleteMyReview(req, res) {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const userObjectId = normalizeObjectId(userId);
    if (!userObjectId) return res.status(400).json({ success: false, message: 'Invalid user' });

    const before = product.reviews.length;
    product.reviews = (product.reviews || []).filter((r) => String(r.userId) !== String(userObjectId));
    if (product.reviews.length === before) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    product.recalculateRating();
    await product.save();

    return res.json({
      success: true,
      message: 'Review deleted',
      rating: product.rating,
      totalReviews: product.totalReviews
    });
  } catch (error) {
    logger.error(`deleteMyReview error: ${error?.message || error}`);
    return res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
}

