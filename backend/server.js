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

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to database and cloudinary
connectDB();
connectCloudinary();

// Allowed origins
const allowedOrigins = [
  "https://sweethome-store.com",
  "https://www.sweethome-store.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    logger.info(`CORS origin check: ${origin}`);
    if (!origin) {
      // Allow requests with no origin like curl or server-to-server
      callback(null, true);
    } else {
      // Normalize origin to lowercase and remove trailing slash
      const normalizedOrigin = origin.toLowerCase().replace(/\/$/, "");
      logger.info(`Normalized CORS origin: ${normalizedOrigin}`);
      // Allowed origins list normalized
      const allowedOriginsNormalized = allowedOrigins.map(o => o.toLowerCase().replace(/\/$/, ""));
      // Check if normalized origin is in allowed list
      if (allowedOriginsNormalized.includes(normalizedOrigin)) {
        callback(null, true);
      } else if (normalizedOrigin.endsWith(".sweethome-store.com")) {
        // Allow any subdomain of sweethome-store.com
        callback(null, true);
      } else {
        logger.error(`Blocked CORS request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  // Prevent duplicate headers
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware once
app.use(cors(corsOptions));

// Middlewares
app.use(morgan("combined", { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API Working");
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Server listener
app.listen(port, () => logger.info(`Server started on PORT : ${port}`));