const express = require("express");
const router = express.Router();
const { getNifty50Historical, getSensexHistorical, getBankNiftyHistorical } = require("../controllers/indicesController");

// GET /api/v1/indices/nifty50/historical - Get Nifty 50 historical data
router.get("/v1/indices/nifty50/historical", getNifty50Historical);

// GET /api/v1/indices/sensex/historical - Get Sensex historical data
router.get("/v1/indices/sensex/historical", getSensexHistorical);

// GET /api/v1/indices/banknifty/historical - Get Bank Nifty historical data
router.get("/v1/indices/banknifty/historical", getBankNiftyHistorical);

module.exports = router;
