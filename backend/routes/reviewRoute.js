import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { deleteMyReview, listProductReviews, upsertMyReview } from '../controllers/reviewController.js';

const router = express.Router();

// Public
router.get('/product/:productId', listProductReviews);

// Authenticated user
router.post('/product/:productId', protect, upsertMyReview);
router.delete('/product/:productId', protect, deleteMyReview);

export default router;

