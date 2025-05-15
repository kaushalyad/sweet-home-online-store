import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter = express.Router();

// Get user's cart
cartRouter.get("/", authUser, getCart);

// Add item to cart
cartRouter.post("/add", authUser, addToCart);

// Update cart item quantity
cartRouter.put("/:itemId", authUser, updateCartItem);

// Remove item from cart
cartRouter.delete("/:itemId", authUser, removeFromCart);

// Clear cart
cartRouter.delete("/clear", authUser, clearCart);

export default cartRouter;
