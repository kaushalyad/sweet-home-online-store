import express from 'express';
import { loginUser, registerUser, adminLogin, verifyToken, forgotPassword, resetPassword, loginWithPhone, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/login/phone', loginWithPhone)
userRouter.post('/admin', adminLogin)
userRouter.post('/verify-token', authUser, verifyToken)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/profile', authUser, getUserProfile)
userRouter.post('/update', authUser, updateUserProfile)

export default userRouter;