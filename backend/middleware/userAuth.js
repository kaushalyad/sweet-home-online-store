import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.json({ success: false, message: 'Authentication required. Please login.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by ID
        const user = await userModel.findById(decoded.id);
        
        if (!user) {
            return res.json({ success: false, message: 'User not found. Please login again.' });
        }
        
        // Add user to request object
        req.user = user;
        
        next();
    } catch (error) {
        console.log(error);
        if (error.name === 'JsonWebTokenError') {
            return res.json({ success: false, message: 'Invalid token. Please login again.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, message: 'Token expired. Please login again.' });
        }
        res.json({ success: false, message: error.message });
    }
};

// Export the middleware function
export default userAuth; 