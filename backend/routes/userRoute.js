import express from 'express';
import { loginUser, registerUser, adminLogin, verifyToken } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/verify-token', authUser, verifyToken)

export default userRouter;