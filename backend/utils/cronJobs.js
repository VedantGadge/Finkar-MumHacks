const cron = require("node-cron");
const User = require("../models/User");
const PortfolioHistory = require("../models/PortfolioHistory");

// Function to take a snapshot of all user portfolios
const snapshotPortfolios = async () => {
  console.log("Running daily portfolio snapshot...");
  try {
    const users = await User.find({});

    for (const user of users) {
      // Calculate current total value
      let totalInvestedValue = 0;
      const assetsSummary = [];

      if (user.portfolio && user.portfolio.length > 0) {
        user.portfolio.forEach((item) => {
          // In production, fetch LIVE price here.
          // For now, use averagePrice or simulated price if available (but sticking to avg for stability in snapshot)
          const itemValue = item.quantity * item.averagePrice;
          totalInvestedValue += itemValue;

          assetsSummary.push({
            ticker: item.ticker,
            quantity: item.quantity,
            value: itemValue,
          });
        });
      }

      const totalValue = (user.finkirkBalance || 0) + totalInvestedValue;

      // Create history record
      await PortfolioHistory.create({
        user: user._id,
        totalValue,
        investedValue: totalInvestedValue,
        cashBalance: user.finkirkBalance || 0,
        assetsSummary,
      });
    }
    console.log(`Snapshot complete for ${users.length} users.`);
  } catch (error) {
    console.error("Error in daily portfolio snapshot:", error);
  }
};

// Schedule the job
// Run at 23:59 every day
const initCronJobs = () => {
  cron.schedule("59 23 * * *", snapshotPortfolios, {
    scheduled: true,
    timezone: "Asia/Kolkata",
  });
  console.log("Cron jobs initialized: Daily Portfolio Snapshot at 23:59 IST");
};

module.exports = { initCronJobs, snapshotPortfolios };
