const express = require("express");
const router = express.Router();
const { getNifty50Historical } = require("../controllers/indicesController");

// GET /api/v1/indices/nifty50/historical - Get Nifty 50 historical data
router.get("/v1/indices/nifty50/historical", getNifty50Historical);

module.exports = router;
