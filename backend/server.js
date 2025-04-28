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
app.use((req, res, next) => {
  console.log('Incoming request headers:', req.headers);
  next();
});
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
    if (!origin) {
      // Allow requests with no origin like curl or server-to-server
      callback(null, true);
    } else if (
      allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Use CORS middleware
// In Express:
// Either completely remove CORS middleware:
// app.use(cors());

// OR configure it to match Nginx:
// Remove this or comment it out
app.use(
  cors({
    origin: "https://sweethome-store.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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

// Server listener
app.listen(port, () => console.log(`Server started on PORT : ${port}`));
