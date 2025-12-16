import express from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt:', {
      email,
      hasPassword: !!password,
      passwordLength: password?.length
    });

    // Admin credentials from environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sweethomeonlinestorehelp@gmail.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Kaushalyad@123';

    if (!email || !password) {
      console.log('Missing credentials:', { email, hasPassword: !!password });
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // Check credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log('Invalid credentials:', { 
        email,
        providedEmail: email === ADMIN_EMAIL,
        providedPassword: password === ADMIN_PASSWORD
      });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Create token
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('Login successful:', { 
      email, 
      tokenLength: token.length
    });

    // Send response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        email: ADMIN_EMAIL,
        name: 'Admin User',
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Login error:', error.message, '\nStack:', error.stack);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again."
    });
  }
});

// Admin token verification route
router.get('/verify-token', protect, admin, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

export default router; 