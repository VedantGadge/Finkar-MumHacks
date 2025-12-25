const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    finkirkBalance: {
      type: Number,
      default: 5000, // Starting balance
      min: 0,
    },
    portfolio: [
      {
        ticker: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        averagePrice: {
          type: Number,
          required: true,
        },
      },
    ],
    achievements: [
      {
        id: String,
        title: String,
        unlockedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    portfolioHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        balance: Number,
        investedValue: Number,
        totalValue: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
