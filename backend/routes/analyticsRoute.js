import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getUserBehavior,
  getPageVisits,
  getConversionRates,
  getSalesAnalytics,
  getProductPerformance,
  getCustomerSegments,
  getAllUserBehavior,
  getAnalytics
} from '../controllers/analyticsController.js';
import UserBehavior from '../models/userBehavior.js';

const router = express.Router();

// All analytics routes are protected and admin-only
router.use(protect, admin);

// Helper function to get start date based on time range
export const getStartDate = (timeRange) => {
  const now = new Date();
  switch (timeRange) {
    case 'day':
      return new Date(now.setDate(now.getDate() - 1));
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setDate(now.getDate() - 7)); // Default to week
  }
};

// Analytics routes
router.get('/user-behavior', getUserBehavior);
router.get('/page-visits', getPageVisits);
router.get('/conversion-rates', getConversionRates);
router.get('/sales-analytics', getSalesAnalytics);
router.get('/product-performance', getProductPerformance);
router.get('/customer-segments', getCustomerSegments);
router.get('/all-behavior', getAllUserBehavior);
router.get('/', getAnalytics);

// Track user interaction
router.post('/track-interaction', async (req, res) => {
  try {
    const { type, element, timestamp, details } = req.body;
    const userId = req.user?._id;

    await UserBehavior.findOneAndUpdate(
      { userId, timestamp: { $gte: new Date(Date.now() - 1000 * 60 * 30) } }, // Last 30 minutes
      {
        $push: {
          interactions: {
            type,
            element,
            timestamp: new Date(timestamp),
            details
          }
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking interaction:', error);
    res.status(500).json({ success: false, message: 'Error tracking interaction' });
  }
});

// Track session data
router.post('/track-session', async (req, res) => {
  try {
    const { scrollDepth, timeOnPage, interactions } = req.body;
    const userId = req.user?._id;

    await UserBehavior.findOneAndUpdate(
      { userId, timestamp: { $gte: new Date(Date.now() - 1000 * 60 * 30) } }, // Last 30 minutes
      {
        $set: {
          scrollDepth,
          timeOnPage
        },
        $push: {
          interactions: {
            $each: interactions
          }
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking session:', error);
    res.status(500).json({ success: false, message: 'Error tracking session' });
  }
});

export default router; 