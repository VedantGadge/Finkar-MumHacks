const User = require("../models/User");
const Transaction = require("../models/Transaction");

// @desc    Get user profile (or create if not exists for demo)
// @route   POST /api/user/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { username } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = await User.create({ username });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user balance and portfolio
// @route   GET /api/user/:username
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Buy stock
// @route   POST /api/user/buy
// @access  Public
exports.buyStock = async (req, res) => {
  const { username, ticker, quantity, price } = req.body;

  if (quantity <= 0)
    return res.status(400).json({ message: "Quantity must be positive" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalCost = quantity * price;

    if (user.finkirkBalance < totalCost) {
      return res.status(400).json({ message: "Insufficient Finkirks" });
    }

    // Deduct balance
    user.finkirkBalance -= totalCost;

    // Update Portfolio
    const portfolioItem = user.portfolio.find((p) => p.ticker === ticker);
    if (portfolioItem) {
      // Calculate new average price
      const oldTotalVal = portfolioItem.quantity * portfolioItem.averagePrice;
      const newTotalVal = oldTotalVal + totalCost;
      const newQuantity = portfolioItem.quantity + quantity;

      portfolioItem.averagePrice = newTotalVal / newQuantity;
      portfolioItem.quantity = newQuantity;
    } else {
      user.portfolio.push({ ticker, quantity, averagePrice: price });
    }

    await user.save();

    // Record Transaction
    await Transaction.create({
      user: user._id,
      ticker,
      type: "BUY",
      quantity,
      price,
      totalAmount: totalCost,
      balanceAfter: user.finkirkBalance,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sell stock
// @route   POST /api/user/sell
// @access  Public
exports.sellStock = async (req, res) => {
  const { username, ticker, quantity, price } = req.body;

  if (quantity <= 0)
    return res.status(400).json({ message: "Quantity must be positive" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const portfolioItem = user.portfolio.find((p) => p.ticker === ticker);
    if (!portfolioItem || portfolioItem.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient shares" });
    }

    const totalRevenue = quantity * price;

    // Update Balance
    user.finkirkBalance += totalRevenue;

    // Calculate Earnings (Revenue - Cost Basis for these shares)
    const costBasis = quantity * portfolioItem.averagePrice;
    const profit = totalRevenue - costBasis;
    user.totalEarnings += profit;

    // Update Portfolio
    portfolioItem.quantity -= quantity;
    if (portfolioItem.quantity === 0) {
      user.portfolio = user.portfolio.filter((p) => p.ticker !== ticker);
    }

    await user.save();

    // Record Transaction
    await Transaction.create({
      user: user._id,
      ticker,
      type: "SELL",
      quantity,
      price,
      totalAmount: totalRevenue,
      balanceAfter: user.finkirkBalance,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Award Finkirks (e.g. for learning)
// @route   POST /api/user/award
// @access  Public
exports.awardFinkirks = async (req, res) => {
  const { username, amount, reason } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.finkirkBalance += amount;

    // Check/Unlock achievements based on balance if needed
    // Simple example: First 1000 coins
    if (
      user.finkirkBalance >= 1000 &&
      !user.achievements.find((a) => a.id === "first_1k")
    ) {
      user.achievements.push({
        id: "first_1k",
        title: "Thousandare: Earned 1000 Finkirks",
      });
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Leaderboard
// @route   GET /api/user/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    // Sort by total balance + earnings (simplification: just balance for now, or totalEarnings)
    // Detailed: We should ideally calculate total net worth (balance + stock value),
    // but stock value changes, so we'd need live prices.
    // For now, let's sort by finkirkBalance for simplicity, or we can use totalEarnings to show "Profitable Traders"

    const users = await User.find({})
      .sort({ finkirkBalance: -1 })
      .limit(10)
      .select("username finkirkBalance totalEarnings achievements");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
