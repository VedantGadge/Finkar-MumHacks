const express = require("express");
const router = express.Router();
const { getTickers, getStockData } = require("../controllers/stocksController");

// GET /api/tickers - Fetch available stock tickers
router.get("/tickers", getTickers);

// GET /api/v1/stocks/:ticker/data - Fetch lightweight stock data
router.get("/v1/stocks/:ticker/data", getStockData);

module.exports = router;
