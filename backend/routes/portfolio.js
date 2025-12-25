const express = require("express");
const router = express.Router();
const {
  getPortfolioSummary,
  getPortfolioHistory,
} = require("../controllers/portfolioController");

router.get("/:username", getPortfolioSummary);
router.get("/:username/history", getPortfolioHistory);

module.exports = router;
