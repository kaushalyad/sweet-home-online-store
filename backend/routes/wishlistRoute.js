import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } from '../controllers/wishlistController.js';
import authUser from '../middleware/auth.js';

const wishlistRouter = express.Router();

// Get user's wishlist
wishlistRouter.get('/', authUser, getWishlist);

// Add item to wishlist
wishlistRouter.post('/add', authUser, addToWishlist);

// Remove item from wishlist
wishlistRouter.delete('/remove/:itemId', authUser, removeFromWishlist);

// Clear wishlist
wishlistRouter.delete('/clear', authUser, clearWishlist);

export default wishlistRouter; 