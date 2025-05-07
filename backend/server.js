import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import logger from "./config/logger.js";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import analyticsRouter from "./routes/analyticsRoute.js";
import cookieParser from "cookie-parser";
import trackUserBehavior from "./middleware/trackUserBehavior.js";
import { errorHandler } from './middleware/errorHandler.js';

// App Config
const app = express();
const port = process.env.PORT || 4000; 

// Connect to database and cloudinary
connectDB();
connectCloudinary();

// CORS configuration
const allowedOrigins = [
  'http://localhost:4173',  // Admin panel
  'http://localhost:3000',  // Frontend
  'http://localhost:5173',  // Vite dev server
  'http://localhost:5174',  // Vite dev server
  'https://www.sweethome-store.com',
  'https://api.sweethome-store.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middlewares
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(trackUserBehavior);

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/analytics", analyticsRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API Working");
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}\nStack: ${err.stack}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}\nStack: ${err.stack}`);
  process.exit(1);
});

// Server listener
app.listen(port, () => {
  logger.info(`Server started on PORT : ${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});