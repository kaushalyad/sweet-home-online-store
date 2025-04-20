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

// middlewares
app.use(express.json());
const allowedOrigins = [
  "https://sweethome-store.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Remove cors middleware usage

// Manual CORS headers middleware at the top
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.some(allowedOrigin => origin && origin.startsWith(allowedOrigin))) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// api endpoints
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

// Server listener
app.listen(port, () => console.log(`Server started on PORT : ${port}`));
