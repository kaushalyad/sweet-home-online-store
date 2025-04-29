import express from "express";
import cors from "cors";
import "dotenv/config";
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
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS origin check:", origin);
    if (!origin) {
      // Allow requests with no origin like curl or server-to-server
      callback(null, true);
    } else {
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        try {
          const allowedUrl = new URL(allowedOrigin);
          const originUrl = new URL(origin);
          return (
            allowedUrl.protocol === originUrl.protocol &&
            allowedUrl.hostname === originUrl.hostname &&
            allowedUrl.port === originUrl.port
          );
        } catch (e) {
          return false;
        }
      });
      if (isAllowed) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Use CORS middleware with options
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middlewares
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
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// CORS error handling middleware to ensure CORS headers on error responses
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} - CORS headers:`, {
      "Access-Control-Allow-Origin": res.getHeader("Access-Control-Allow-Origin"),
      "Access-Control-Allow-Credentials": res.getHeader("Access-Control-Allow-Credentials"),
    });
  });
  next();
});


// Server listener
app.listen(port, () => console.log(`Server started on PORT : ${port}`));
