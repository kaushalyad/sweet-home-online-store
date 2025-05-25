import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createSharedContent,
  getSharedContent,
  deleteSharedContent
} from '../controllers/sharedContentController.js';

const router = express.Router();

// Public route to get shared content
router.get('/:contentId', getSharedContent);

// Protected routes
router.post('/', protect, createSharedContent);
router.delete('/:contentId', protect, deleteSharedContent);

export default router; 