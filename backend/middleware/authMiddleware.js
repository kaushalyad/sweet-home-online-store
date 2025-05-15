import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

// Protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header or cookie
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // For hardcoded admin, we only need to check the email
      if (decoded.email === 'sweethomeonlinestorehelp@gmail.com' && decoded.role === 'admin') {
        req.user = {
          email: decoded.email,
          role: 'admin',
          name: 'Admin User'
        };
        next();
      } else {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, invalid token'
        });
      }
    } catch (error) {
      logger.error(`Token verification error: ${error.message}`);
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
    return res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
};

export { protect, admin }; 