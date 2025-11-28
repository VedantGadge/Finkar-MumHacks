const express = require("express");
const router = express.Router();
const {
  generateCaseStudy,
  generateBatchCaseStudy,
} = require("../controllers/caseStudyController");

// POST /api/case-study - Generate case study for a ticker
router.post("/case-study", generateCaseStudy);

// POST /api/case-study/batch - Generate case studies for multiple tickers
router.post("/case-study/batch", generateBatchCaseStudy);

module.exports = router;
