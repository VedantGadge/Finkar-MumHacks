const { API_BASE_URL } = require("../config/constants");

// GET /api/tickers - Fetch available stock tickers
const getTickers = async (req, res) => {
  try {
    console.log("Fetching tickers from HuggingFace API...");
    const response = await fetch(`${API_BASE_URL}/tickers`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HuggingFace API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error(
        "Failed to parse JSON response:",
        responseText.substring(0, 200)
      );
      throw new Error(`Invalid JSON response from API: ${e.message}`);
    }

    console.log(`Successfully fetched ${data.count} tickers`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching tickers:", error);
    res.status(500).json({
      error: "Failed to fetch tickers",
      message: error.message,
    });
  }
};

// GET /api/v1/stocks/:ticker/data - Fetch lightweight stock data
const getStockData = async (req, res) => {
  try {
    const { ticker } = req.params;

    if (!ticker) {
      return res.status(400).json({
        error: "Ticker is required",
      });
    }

    console.log(`Fetching lightweight stock data for ${ticker}...`);

    const response = await fetch(`${API_BASE_URL}/stocks/${ticker}/data`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HuggingFace API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error(
        "Failed to parse JSON response:",
        responseText.substring(0, 200)
      );
      throw new Error(`Invalid JSON response from API: ${e.message}`);
    }

    console.log(`Successfully fetched stock data for ${ticker}`);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching stock data for ${req.params.ticker}:`, error);
    res.status(500).json({
      error: "Failed to fetch stock data",
      message: error.message,
    });
  }
};

module.exports = {
  getTickers,
  getStockData,
};
