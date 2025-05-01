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
      // Allow all subdomains of sweethome-store.com, including www and root domain
      const regex = /^https:\/\/(www\.)?sweethome-store\.com$/i;
      if (regex.test(normalizedOrigin)) {
        callback(null, origin);
      } else if (normalizedOrigin.endsWith(".sweethome-store.com")) {
        // Allow any subdomain of sweethome-store.com
        callback(null, origin);
      } else if (normalizedOrigin === "https://sweethome-store.com") {
        // Explicitly allow root domain without www
        callback(null, origin);
      } else if (origin === undefined) {
        // Allow requests with undefined origin (e.g., curl, Postman)
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
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Middleware to set CORS headers on all responses (including errors)
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (origin && allowedOrigins.includes(origin.toLowerCase())) {
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,token");
//   }
//   next();
// });

// Explicitly handle OPTIONS requests to ensure CORS headers are set
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.options("*", cors(corsOptions));

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

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl} - Body: ${JSON.stringify(req.body)}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

// Global unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

// Global uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}\nStack: ${error.stack}`);
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});

// CORS error handling middleware to ensure CORS headers on error responses
app.use((req, res, next) => {
  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} - CORS headers: ${JSON.stringify({
      "Access-Control-Allow-Origin": res.getHeader("Access-Control-Allow-Origin"),
      "Access-Control-Allow-Credentials": res.getHeader("Access-Control-Allow-Credentials"),
    })}`);
  });
  next();
});

// Server listener
app.listen(port, () => logger.info(`Server started on PORT : ${port}`));
