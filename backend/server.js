const express = require("express");
const cors = require("cors");
const { API_BASE_URL } = require("./config/constants");
const connectDB = require("./config/db");
require("dotenv").config();

// Connect to Database
connectDB();

// Import routes
const stocksRoutes = require("./routes/stocks");
const caseStudyRoutes = require("./routes/caseStudy");
const marketRoutes = require("./routes/market");
const indicesRoutes = require("./routes/indices");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "FinKar Backend Server Running",
    endpoints: [
      "GET /api/tickers",
      "POST /api/case-study",
      "POST /api/case-study/batch",
      "GET /api/v1/stocks/:ticker/data",
      "GET /api/market-indices",
      "GET /api/sector-performance",
    ],
  });
});

// Mount routes
app.use("/api", stocksRoutes);
app.use("/api", caseStudyRoutes);
app.use("/api", marketRoutes);
app.use("/api", indicesRoutes);
app.use("/api/user", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FinKar Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Proxying requests to: ${API_BASE_URL}`);
});
