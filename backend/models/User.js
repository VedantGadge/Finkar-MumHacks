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
      default: 500, // Starting balance
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
