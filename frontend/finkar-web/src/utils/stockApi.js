/**
 * API service for stock-related endpoints
 */

// Use environment variable for API URL (defaults to localhost for development)
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

/**
 * Fetches the list of available stock tickers
 * @returns {Promise<Object>} Object containing count and tickers array
 */
export const fetchTickers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tickers: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tickers:", error);
    throw error;
  }
};

/**
 * Generates a case study for a given stock ticker
 * @param {string} ticker - Stock ticker symbol (e.g., "RELIANCE.NS")
 * @param {string} companyName - Optional company name
 * @param {boolean} useFinbert - Optional flag to use FinBERT model
 * @param {boolean} useGroq - Optional flag to use Groq
 * @returns {Promise<Object>} Case study data
 */
export const generateCaseStudy = async (
  ticker,
  companyName = "",
  useFinbert = true,
  useGroq = true
) => {
  try {
    const requestBody = {
      ticker,
<<<<<<< HEAD
      company_name: companyName,
      use_finbert: useFinbert,
      use_groq: useGroq,
=======
      company_name: companyName || getTickerDisplayName(ticker),
      use_finbert: true,
      use_groq: true,
>>>>>>> aed950527bb7a1650738e1946004ba50c099afee
    };

    console.log(
      "Frontend sending to Backend:",
      JSON.stringify(requestBody, null, 2)
    );

    const response = await fetch(`${API_BASE_URL}/case-study`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to generate case study: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating case study:", error);
    throw error;
  }
};

/**
 * Generates case studies for multiple tickers in batch
 * @param {string[]} tickers - Array of stock ticker symbols
 * @param {boolean} useFinbert - Optional flag to use FinBERT model
 * @param {boolean} useGroq - Optional flag to use Groq
 * @returns {Promise<Object>} Batch job response
 */
export const batchGenerateCaseStudies = async (
  tickers,
  useFinbert = false,
  useGroq = false
) => {
  try {
    const requestBody = {
      tickers,
      use_finbert: true,
      use_groq: true,
    };

    const response = await fetch(`${API_BASE_URL}/case-study/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to initiate batch generation: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error initiating batch case study generation:", error);
    throw error;
  }
};

/**
 * Helper function to extract company name from ticker
 * @param {string} ticker - Stock ticker symbol
 * @returns {string} Simplified ticker name
 */
export const getTickerDisplayName = (ticker) => {
  return ticker.replace(".NS", "");
};

/**
 * Fetches market indices data
 * @returns {Promise<Array>} Array of market indices
 */
export const fetchMarketIndices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/market-indices`);
    if (!response.ok) {
      throw new Error("Failed to fetch market indices");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching market indices:", error);
    return [];
  }
};

/**
 * Fetches sector performance data
 * @returns {Promise<Array>} Array of sector performance data
 */
export const fetchSectorPerformance = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sector-performance`);
    if (!response.ok) {
      throw new Error("Failed to fetch sector performance");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching sector performance:", error);
    return [];
  }
};

/**
 * Fetches lightweight stock data for quick card display
 * @param {string} ticker - Stock ticker symbol (e.g., "TCS.NS")
 * @returns {Promise<Object>} Basic stock data including end_price, price_change_pct, etc.
 */
export const fetchStockData = async (ticker) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/stocks/${ticker}/data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch stock data for ${ticker}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching stock data for ${ticker}:`, error);
    throw error;
  }
};

/**
 * Fetches lightweight stock data for multiple tickers in parallel
 * @param {string[]} tickers - Array of stock ticker symbols
 * @returns {Promise<Object>} Object mapping ticker to stock data
 */
export const fetchMultipleStockData = async (tickers) => {
  try {
    const promises = tickers.map((ticker) =>
      fetchStockData(ticker)
        .then((data) => ({ ticker, data, success: true }))
        .catch((error) => {
          console.error(`Failed to fetch ${ticker}:`, error);
          return { ticker, success: false, error };
        })
    );

    const results = await Promise.allSettled(promises);

    // Convert array to object mapping ticker -> data
    const stockDataMap = {};
    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        stockDataMap[result.value.ticker] = result.value.data;
      }
    });

    return stockDataMap;
  } catch (error) {
    console.error("Error fetching multiple stock data:", error);
    throw error;
  }
};

/**
 * Fetches Nifty 50 historical data
 * @param {string} period - Period for data (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @returns {Promise<Object>} Nifty 50 historical data
 */
export const fetchNifty50Historical = async (period = "1mo") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/indices/nifty50/historical?period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Nifty 50 historical data: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Nifty 50 historical data:", error);
    throw error;
  }
};

/**
 * Fetches Sensex historical data
 * @param {string} period - Period for data (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @returns {Promise<Object>} Sensex historical data
 */
export const fetchSensexHistorical = async (period = "1mo") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/indices/sensex/historical?period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Sensex historical data: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Sensex historical data:", error);
    throw error;
  }
};

/**
 * Fetches Bank Nifty historical data
 * @param {string} period - Period for data (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @returns {Promise<Object>} Bank Nifty historical data
 */
export const fetchBankNiftyHistorical = async (period = "1mo") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/indices/banknifty/historical?period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Bank Nifty historical data: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Bank Nifty historical data:", error);
    throw error;
  }
};
