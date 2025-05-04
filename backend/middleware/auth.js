import jwt from 'jsonwebtoken'
import logger from '../config/logger.js'

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        logger.info('Auth header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn('Missing or invalid Authorization header');
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required. Please login again.' 
            });
        }

        const token = authHeader.split(' ')[1];
        logger.info('Token:', token);

        if (!token) {
            logger.warn('No token provided');
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided. Please login again.' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            logger.info('Decoded token:', decoded);
            
            if (!decoded || !decoded.id) {
                logger.warn('Invalid token format');
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid token format. Please login again.' 
                });
            }

            req.user = { id: decoded.id };
            logger.info('User ID set in request:', req.user.id);
            next();
        } catch (error) {
            logger.error('Token verification error:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Your session has expired. Please login again.' 
                });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid token. Please login again.' 
                });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Authentication error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Authentication failed. Please try again.' 
        });
    }
}

export default authUser;