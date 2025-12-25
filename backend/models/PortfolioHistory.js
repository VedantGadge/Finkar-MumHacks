const mongoose = require("mongoose");

const PortfolioHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    totalValue: {
      type: Number,
      required: true,
    },
    investedValue: {
      type: Number,
      required: true,
    },
    cashBalance: {
      type: Number,
      required: true,
    },
    // Optional: Detailed snapshot of assets if needed later
    assetsSummary: [
      {
        ticker: String,
        quantity: Number,
        value: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PortfolioHistory", PortfolioHistorySchema);
