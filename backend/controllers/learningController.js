const getDailyLearning = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Mock response based on user request
    const response = {
      date: new Date().toISOString().split('T')[0],
      cards: [
        {
          front: "What’s your monthly spending compared to your balance?",
          back: "You spent ₹65,237 last month, nearly 12.9% of your ₹505,488 balance. Time to budget wisely!"
        },
        {
          front: "Zero savings rate? That's bold!",
          back: "With a 0% savings rate and ₹505,488 in hand, your financial moves are all in! Consider building that cushion for surprises!"
        },
        {
          front: "NIFTY just hit a rough patch!",
          back: "NIFTY is currently down at ₹26,142.1, a reminder that staying informed helps your investments!"
        },
        {
          front: "Gold’s glitter dimmed a little!",
          back: "Gold prices dipped to ₹4,480.6 recently. It’s a good time to assess your metal investments!"
        },
        {
          front: "Did you know you can retire at 60?",
          back: "With smart investments now, you can build wealth to retire comfortably by 60. Start early, go aggressive!"
        }
      ]
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching daily learning:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getDailyLearning
};
