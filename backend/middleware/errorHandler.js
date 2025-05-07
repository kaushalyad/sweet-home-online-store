import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};

export { errorHandler }; 