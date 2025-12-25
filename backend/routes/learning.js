const express = require("express");
const router = express.Router();
const learningController = require("../controllers/learningController");

// GET /api/learning/daily
router.get("/learning/daily", learningController.getDailyLearning);

module.exports = router;
