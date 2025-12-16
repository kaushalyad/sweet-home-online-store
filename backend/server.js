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
import adminRouter from "./routes/adminRoute.js";
import cookieParser from "cookie-parser";
import trackUserBehavior from "./middleware/trackUserBehavior.js";
import { errorHandler } from './middleware/errorHandler.js';
import sharedContentRouter from './routes/sharedContentRoute.js';
import uploadRouter from './routes/uploadRoute.js';
import messageRouter from './routes/messageRoute.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:4173", // Admin panel
      "http://localhost:3000", // Frontend
      "http://localhost:5173", // Vite dev server
      "http://localhost:5174", // Vite dev server
      "http://localhost:5175", // Additional Vite dev server
      "https://www.sweethome-store.com",
      "https://sweethome-store.com",
      "https://api.sweethome-store.com",
    ],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Connect to database and cloudinary
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB');

    // Connect to Cloudinary (optional)
    try {
      await connectCloudinary();
      logger.info('Connected to Cloudinary');
    } catch (cloudinaryError) {
      logger.error('Cloudinary connection failed:', cloudinaryError);
      // Don't exit process for Cloudinary failure
    }

    // CORS configuration
    const allowedOrigins = [
      "http://localhost:4173", // Admin panel
      "http://localhost:3000", // Frontend
      "http://localhost:5173", // Vite dev server
      "http://localhost:5174", // Vite dev server
      "http://localhost:5175", // Additional Vite dev server
      "https://www.sweethome-store.com",
      "https://sweethome-store.com",
      "https://api.sweethome-store.com",
    ];

    const corsOptions = {
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "token", "X-Requested-With", "Accept", "Origin"],
      exposedHeaders: ["Content-Range", "X-Content-Range"],
      maxAge: 86400, // 24 hours
    };

    // Apply CORS middleware
    app.use(cors(corsOptions));

    // Add pre-flight OPTIONS handler for all routes
    app.options('*', cors(corsOptions));

    // Increase JSON payload limit
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    // Middlewares
    app.use(cookieParser());
    app.use(morgan("dev"));
    app.use(trackUserBehavior);

    // Add security headers
    app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });

    // API endpoints
    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/cart", cartRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/wishlist", wishlistRouter);
    app.use("/api/analytics", analyticsRouter);
    app.use("/api/admin", adminRouter);
    app.use("/api/shared", sharedContentRouter);
      app.use("/api/upload", uploadRouter);
      app.use("/api/messages", messageRouter);

    // Root endpoint
    app.get("/", (req, res) => {
      res.send("API Working");
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).send("Route not found");
    });

    // Error handler
    app.use(errorHandler);

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.id}`);

      // Join user to their room for personalized updates
      socket.on('join-user-room', (userId) => {
        if (userId) {
          socket.join(`user_${userId}`);
          logger.info(`User ${userId} joined their room`);
        }
      });

      // Join admin room for real-time analytics
      socket.on('join-admin-room', () => {
        socket.join('admin_room');
        logger.info('Admin joined admin room');
      });

      // Handle real-time tracking events
      socket.on('user-activity', (data) => {
        // Broadcast to admin room for live traffic monitoring
        io.to('admin_room').emit('live-traffic', {
          ...data,
          timestamp: new Date(),
          socketId: socket.id
        });
      });

      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
      });
    });

    // Make io available to routes
    app.set('io', io);

    // Start server
    server.listen(port, '0.0.0.0', () => {
      logger.info(`Server started on PORT : ${port}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Don't exit process for unhandled rejections
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();