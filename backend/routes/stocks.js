const express = require("express");
const router = express.Router();
const { getTickers, getStockData } = require("../controllers/stocksController");

// GET /api/tickers - Fetch available stock tickers
router.get("/tickers", getTickers);

// GET /api/v1/stocks/:ticker/data - Fetch lightweight stock data
router.get("/v1/stocks/:ticker/data", getStockData);

// GET /api/v1/stocks/:ticker/historical - Fetch historical stock data
router.get("/v1/stocks/:ticker/historical", require("../controllers/stocksController").getStockHistorical);

// POST /api/v1/stocks/batch - Fetch data for multiple tickers
router.post("/v1/stocks/batch", require("../controllers/stocksController").getBatchStockData);

module.exports = router;
