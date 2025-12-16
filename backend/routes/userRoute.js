import express from 'express';
import { 
  loginUser, 
  registerUser, 
  adminLogin, 
  verifyToken, 
  refreshToken,
  getUserProfile, 
  updateUserProfile, 
  listUsers,
  updatePassword,
  downloadUserData,
  deleteAccount,
  verifyAdmin,
  forgotPassword,
  resetPassword
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', adminLogin);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/verify', protect, verifyToken);
router.post('/verify-token', protect, verifyToken); // Alias for verify
router.route('/profile')
  .get(protect, getUserProfile)
  .post(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.post('/update-password', protect, updatePassword);
router.get('/download-data', protect, downloadUserData);
router.post('/delete-account', protect, deleteAccount);

// Admin routes
router.get('/list', protect, admin, listUsers);
router.post('/admin', protect, verifyAdmin);

export default router;