const { API_BASE_URL } = require("../config/constants");
const cache = require("../utils/cache");

// GET /api/v1/indices/nifty50/historical - Get Nifty 50 historical data
const getNifty50Historical = async (req, res) => {
  try {
    const { period = "1mo" } = req.query;
    const cacheKey = `nifty50_historical_${period}`;

    // Check cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log(`[CACHE HIT] Nifty 50 (${period})`);
        return res.json(cachedData);
    }
    
    console.log(`[CACHE MISS] Nifty 50 (${period}) - Fetching from API...`);

    const response = await fetch(
      `${API_BASE_URL}/indices/nifty50/historical?period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `External API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    
    // Cache result
    cache.set(cacheKey, data);
    console.log(`[API SUCCESS] Nifty 50 (${period}) cached (TTL: 300s)`);

    res.json(data);
  } catch (error) {
    console.error("Error fetching Nifty 50 historical data:", error);
    res.status(500).json({
      error: "Failed to fetch Nifty 50 historical data",
      message: error.message,
    });
  }
};

// GET /api/v1/indices/sensex/historical - Get Sensex historical data
const getSensexHistorical = async (req, res) => {
  try {
    const { period = "1mo" } = req.query;
    const cacheKey = `sensex_historical_${period}`;

    // Check cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log(`[CACHE HIT] Sensex (${period})`);
        return res.json(cachedData);
    }

    console.log(`[CACHE MISS] Sensex (${period}) - Fetching from API...`);

    const response = await fetch(
      `${API_BASE_URL}/indices/sensex/historical?period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `External API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    
    // Cache result
    cache.set(cacheKey, data);
    console.log(`[API SUCCESS] Sensex (${period}) cached (TTL: 300s)`);

    res.json(data);
  } catch (error) {
    console.error("Error fetching Sensex historical data:", error);
    res.status(500).json({
      error: "Failed to fetch Sensex historical data",
      message: error.message,
    });
  }
};

// GET /api/v1/indices/banknifty/historical - Get Bank Nifty historical data
const getBankNiftyHistorical = async (req, res) => {
  try {
    const { period = "1mo" } = req.query;
    const cacheKey = `banknifty_historical_${period}`;

    // Check cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log(`[CACHE HIT] Bank Nifty (${period})`);
        return res.json(cachedData);
    }

    console.log(`[CACHE MISS] Bank Nifty (${period}) - Fetching from API...`);

    const response = await fetch(
      `${API_BASE_URL}/indices/banknifty/historical?period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `External API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    
    // Cache result
    cache.set(cacheKey, data);
    console.log(`[API SUCCESS] Bank Nifty (${period}) cached (TTL: 300s)`);

    res.json(data);
  } catch (error) {
    console.error("Error fetching Bank Nifty historical data:", error);
    res.status(500).json({
      error: "Failed to fetch Bank Nifty historical data",
      message: error.message,
    });
  }
};

module.exports = {
  getNifty50Historical,
  getSensexHistorical,
  getBankNiftyHistorical,
};
