const { API_BASE_URL } = require("../config/constants");
const cache = require("../utils/cache");

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



// GET /api/v1/stocks/:ticker/historical - Fetch historical stock data
const getStockHistorical = async (req, res) => {
  try {
    const { ticker } = req.params;
    const { period = "1mo" } = req.query;

    if (!ticker) {
      return res.status(400).json({
        error: "Ticker is required",
      });
    }

    console.log(
      `Fetching historical stock data for ${ticker} (period: ${period})...`
    );

    const response = await fetch(
      `${API_BASE_URL}/stocks/${ticker}/historical?period=${period}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HuggingFace API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`Successfully fetched historical data for ${ticker}`);
    res.json(data);
  } catch (error) {
    console.error(
      `Error fetching historical data for ${req.params.ticker}:`,
      error
    );
    res.status(500).json({
      error: "Failed to fetch historical stock data",
      message: error.message,
    });
  }
};

// POST /api/v1/stocks/batch - Fetch data for multiple tickers with caching
const getBatchStockData = async (req, res) => {
  try {
    const { tickers } = req.body;

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return res.status(400).json({
        error: "Tickers array is required",
      });
    }

    console.log(`Processing batch request for ${tickers.length} tickers...`);

    const results = {};
    const tickersToFetch = [];

    // 1. Check cache first
    tickers.forEach((ticker) => {
      const cachedData = cache.get(ticker);
      if (cachedData) {
        console.log(`[CACHE HIT] ${ticker}`);
        results[ticker] = cachedData;
      } else {
        console.log(`[CACHE MISS] ${ticker} - Scheduled for fetch`);
        tickersToFetch.push(ticker);
      }
    });

    console.log(
      `Batch Summary: ${Object.keys(results).length} cached, ${
        tickersToFetch.length
      } to fetch`
    );

    // 2. Fetch missing data in parallel
    if (tickersToFetch.length > 0) {
      console.log("Fetching from Upstream API...");
      const fetchPromises = tickersToFetch.map(async (ticker) => {
        try {
            // Note: Reusing the same logic as single stock fetch but optimized for internal call
            // We call the external API directly here to avoid HTTP overhead of calling our own controller
            const response = await fetch(`${API_BASE_URL}/stocks/${ticker}/data`);
            
            if (!response.ok) {
                console.error(`[API ERROR] Failed to fetch ${ticker}: ${response.statusText}`);
                return null;
            }

            const responseText = await response.text();
            const data = JSON.parse(responseText);
            
            // Cache the successful result with 5 min TTL
            cache.set(ticker, data);
            console.log(`[API SUCCESS] ${ticker} fetched and cached (TTL: 300s)`);
            
            return { ticker, data };
        } catch (err) {
            console.error(`[API ERROR] Error fetching ${ticker} for batch:`, err);
            return null;
        }
      });

      const fetchedResults = await Promise.all(fetchPromises);

      fetchedResults.forEach((result) => {
        if (result) {
          results[result.ticker] = result.data;
        }
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Error in batch stock fetch:", error);
    res.status(500).json({
      error: "Failed to process batch request",
      message: error.message,
    });
  }
};

module.exports = {
  getTickers,
  getStockData,
  getStockHistorical,
  getBatchStockData,
};
