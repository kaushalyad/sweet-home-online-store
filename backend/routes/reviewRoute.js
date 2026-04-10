import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listProductReviews,
  addProductReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/product/:productId", listProductReviews);
router.post("/product/:productId", protect, addProductReview);

export default router;
