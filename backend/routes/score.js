const express = require("express");
const router = express.Router();
const { getFinancialScore } = require("../controllers/scoreController");

// GET /api/score/:user_id - Fetch user's financial score
router.get("/score/:user_id", getFinancialScore);

module.exports = router;
