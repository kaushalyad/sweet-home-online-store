import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import logger from '../config/logger.js';

// Protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header or cookie
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers.token) {
      token = req.headers.token;
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      logger.warn('No token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user in database
      const user = await userModel.findById(decoded.id);
      
      if (!user) {
        logger.warn(`User not found for ID: ${decoded.id}`);
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        });
      }

      // Add user to request object
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      };

      logger.info(`User authenticated: ${user.email} (${user.role})`);
      next();
    } catch (error) {
      logger.error(`Token verification error: ${error.message}`);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token'
      });
    }
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    logger.warn(`Unauthorized admin access attempt by user: ${req.user?.email}`);
    return res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
};

export { protect, admin }; 