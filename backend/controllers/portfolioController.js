const User = require("../models/User");
// const { getTickerPrice } = require("../utils/stockApi"); // Removed unused import

// @desc    Get portfolio summary
// @route   GET /api/portfolio/:username
// @access  Public
exports.getPortfolioSummary = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate current portfolio value
    let totalInvestedValue = 0;

    // In a real app with live prices, we'd fetch current prices here.
    // For now, we'll use the average price or just assume some fluctuation for demo,
    // or rely on frontend to fetch current prices and calculate.
    // Let's return the raw portfolio and let frontend calculate current total value
    // by fetching live prices, OR we can do a quick mock calculation here if we had price access.

    // We'll trust the frontend to calculate "Current Value" precisely,
    // but we can provide "Basis Cost" (invested amount) easily.

    const portfolioItems = user.portfolio.map((item) => {
      totalInvestedValue += item.quantity * item.averagePrice;
      return {
        ...item._doc,
        currentValue: item.quantity * item.averagePrice, // Placeholder, usually would be live price
        investedValue: item.quantity * item.averagePrice,
      };
    });

    const summary = {
      username: user.username,
      availableBalance: user.finkirkBalance,
      totalInvested: totalInvestedValue,
      totalSpent: user.totalSpent || 0,
      totalEarnings: user.totalEarnings || 0,
      portfolio: portfolioItems,
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get portfolio history for chart
// @route   GET /api/portfolio/:username/history
// @access  Public
exports.getPortfolioHistory = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // For the demo/hackathon, we will regenerate the simulated history on every request
    // This ensures the chart always ends at the user's CURRENT total value
    const today = new Date();

    // Calculate current simulated Base Value (Balance + Investments)
    const currentPortfolioValue = user.portfolio.reduce(
      (acc, item) => acc + item.quantity * item.averagePrice,
      0
    );
    const baseValue = (user.finkirkBalance || 0) + currentPortfolioValue;

    let history = [];

    // Generate 30 days of history
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Create a realistic-looking curve
      // i=30 (past) -> i=0 (today)
      // trend: roughly growing or stable
      const trend = (30 - i) * (baseValue * 0.005); // slight upward trend
      const randomFluctuation =
        Math.sin(i) * baseValue * 0.02 +
        (Math.random() - 0.5) * baseValue * 0.05;

      // Calculate point value
      let pointValue = baseValue - i * (baseValue * 0.01) + randomFluctuation;

      // Ensure today matches exactly
      if (i === 0) {
        pointValue = baseValue;
      }

      // Prevent negatives
      if (pointValue < 100) pointValue = 100 + Math.random() * 50;

      history.push({
        date: date,
        open: pointValue - Math.random() * 50,
        high: pointValue + Math.random() * 100,
        low: pointValue - Math.random() * 100,
        close: pointValue,
      });
    }

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
