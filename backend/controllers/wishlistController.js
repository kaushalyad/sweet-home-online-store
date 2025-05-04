import userModel from '../models/userModel.js';
import logger from '../config/logger.js';

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await userModel.findById(userId)
      .populate('wishlist');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    logger.info(`Wishlist fetched successfully for user: ${userId}`);

    return res.status(200).json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    logger.error('Error fetching wishlist:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist"
    });
  }
};

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist"
      });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    logger.info(`Product added to wishlist for user: ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist
    });
  } catch (error) {
    logger.error('Error adding to wishlist:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to add to wishlist"
    });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    logger.info(`Product removed from wishlist for user: ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: user.wishlist
    });
  } catch (error) {
    logger.error('Error removing from wishlist:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist"
    });
  }
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Clear wishlist
    user.wishlist = [];
    await user.save();

    logger.info(`Wishlist cleared for user: ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully"
    });
  } catch (error) {
    logger.error('Error clearing wishlist:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear wishlist"
    });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist, clearWishlist }; 