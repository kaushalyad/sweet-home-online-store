import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import logger from '../config/logger.js';

// Get cart
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Ensure cartData is an object
        const cartData = user.cartData || {};
        
        // Clean up any invalid values
        Object.keys(cartData).forEach(key => {
            if (!cartData[key] || cartData[key] < 1) {
                delete cartData[key];
            }
        });

        // Save the cleaned cart data
        if (Object.keys(cartData).length !== Object.keys(user.cartData || {}).length) {
            await userModel.findByIdAndUpdate(userId, { $set: { cartData } });
        }

        return res.status(200).json({
            success: true,
            cartData
        });
    } catch (error) {
        console.error("Error getting cart:", error);
        return res.status(500).json({
            success: false,
            message: "Error getting cart",
            error: error.message
        });
    }
};

// Add to cart
const addToCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        let { quantity = 1 } = req.body;
        const userId = req.user.id;

        // Ensure quantity is a valid number
        quantity = Number(quantity);
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        }

        console.log('Adding to cart:', { userId, itemId, quantity });

        if (!itemId) {
            return res.status(400).json({ 
                success: false,
                message: "Item ID is required" 
            });
        }

        // Check if product exists
        const product = await productModel.findById(itemId);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: "Product not found" 
            });
        }

        // Get current user data
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        console.log('Current user cartData:', user.cartData);

        // Initialize cartData if it doesn't exist
        if (!user.cartData || typeof user.cartData !== 'object') {
            user.cartData = {};
        }

        // Update cartData
        if (user.cartData[itemId]) {
            user.cartData[itemId] = Math.max(1, user.cartData[itemId] + quantity);
        } else {
            user.cartData[itemId] = quantity;
        }

        // Clean up any null or invalid values
        Object.keys(user.cartData).forEach(key => {
            if (!user.cartData[key] || user.cartData[key] < 1) {
                delete user.cartData[key];
            }
        });

        console.log('Updated cartData:', user.cartData);

        // Save the user document with the updated cartData
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: { cartData: user.cartData } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({
                success: false,
                message: "Failed to update cart"
            });
        }

        console.log('User saved successfully with cartData:', updatedUser.cartData);

        // Return the updated cart data
        return res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            cartData: updatedUser.cartData
        });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error adding item to cart", 
            error: error.message 
        });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;

    if (!itemId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Item ID and quantity are required"
      });
    }

    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.cartData || !user.cartData[itemId]) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      delete user.cartData[itemId];
    } else {
      user.cartData[itemId] = quantity;
    }

    await user.save();

    logger.info(`Cart updated for user: ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cartData: user.cartData
    });
  } catch (error) {
    logger.error('Error updating cart:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart"
    });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.cartData || !user.cartData[itemId]) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    // Remove item
    delete user.cartData[itemId];

    await user.save();

    logger.info(`Item removed from cart for user: ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cartData: user.cartData
    });
  } catch (error) {
    logger.error('Error removing from cart:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove from cart"
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.cartData = {};
    await user.save();

    logger.info(`Cart cleared for user: ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    logger.error('Error clearing cart:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart"
    });
  }
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };