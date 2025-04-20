import express from "express";

const app = express();
const port = 5000;

const allowedOrigins = [
  "https://sweethome-store.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Manual CORS headers middleware
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

app.get("/api/product/list", (req, res) => {
  res.json({
    success: true,
    products: [
      { id: 1, name: "Test Product 1", price: 100 },
      { id: 2, name: "Test Product 2", price: 200 },
    ],
  });
});

app.listen(port, () => {
  console.log(`Test CORS server running on port ${port}`);
});
