import express from 'express';
import { subscribe, unsubscribe, getAllSubscribers } from '../controllers/newsletterController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin routes
router.get('/subscribers', protect, admin, getAllSubscribers);

export default router;
