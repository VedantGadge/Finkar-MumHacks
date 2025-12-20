const express = require("express");
const router = express.Router();
const {
  loginUser,
  getUserProfile,
  buyStock,
  sellStock,
  getLeaderboard,
  awardFinkirks,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/award", awardFinkirks);
router.get("/leaderboard", getLeaderboard);
router.get("/:username", getUserProfile);
router.post("/buy", buyStock);
router.post("/sell", sellStock);

module.exports = router;
