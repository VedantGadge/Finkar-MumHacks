const express = require("express");
const router = express.Router();
const {
  getMarketIndices,
  getSectorPerformance,
} = require("../controllers/marketController");

// GET /api/market-indices - Fetch market indices data
router.get("/market-indices", getMarketIndices);

// GET /api/sector-performance - Fetch sector performance data
router.get("/sector-performance", getSectorPerformance);

module.exports = router;
