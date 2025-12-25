/**
 * API service for stock-related endpoints
 */

// Use environment variable for API URL (defaults to deployed backend for APK)
// Note: We point to /v1 directly because the upstream python API (HF Space) uses /api/v1
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://yashganatra-finkar.hf.space/api/v1";
const CACHE_KEY_PREFIX = "finkar_cache_";
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Helper to fetch data with client-side caching via localStorage
 * @param {string} key - Unique cache key
 * @param {Function} fetchFn - Function that returns a Promise resolving to the data
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Promise<Object>} Cached or fresh data
 */
const fetchWithCache = async (key, fetchFn, ttl = DEFAULT_TTL) => {
  try {
    const fullKey = `${CACHE_KEY_PREFIX}${key}`;
    const cachedItem = localStorage.getItem(fullKey);

    if (cachedItem) {
      const { data, timestamp } = JSON.parse(cachedItem);
      const isExpired = Date.now() - timestamp > ttl;

      if (!isExpired) {
        // console.log(`[CLIENT CACHE HIT] ${key}`);
        return data;
      }
    }

    // console.log(`[CLIENT CACHE MISS] ${key}`);
    const data = await fetchFn();
    
    try {
      localStorage.setItem(fullKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn("Failed to save to localStorage (quota exceeded?)", e);
    }

    return data;
  } catch (error) {
    console.error(`Cache error for ${key}:`, error);
    // Fallback to fresh fetch if cache operations fail
    return await fetchFn();
  }
};

/**
 * Fetches the list of available stock tickers
 * @returns {Promise<Object>} Object containing count and tickers array
 */
export const fetchTickers = async () => {
  return fetchWithCache("tickers", async () => {
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

        return await response.json();
    } catch (error) {
        console.error("Error fetching tickers:", error);
        throw error;
    }
  });
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
  useFinbert = false,
  useGroq = false
) => {
  try {
    const requestBody = {
      ticker,
      company_name: companyName || ticker.replace(".NS", ""),
      use_finbert: useFinbert,
      use_groq: useGroq,
    };

    console.log("Frontend sending to Backend:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${API_BASE_URL}/case-study/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate case study: ${response.status} ${response.statusText} - ${errorText}`);
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
/**
 * Fetches market indices data
 * NOTE: Hardcoded locally for APK compatibility with existing HF deployment
 */
export const fetchMarketIndices = async () => {
  // Return static data immediately (mocking the backend response)
  return [
    {
      name: "NIFTY 50",
      value: 19674.25,
      change: 142.3,
      changePercent: 0.73,
      trendData: [19520, 19545, 19580, 19610, 19635, 19650, 19674],
    },
    {
      name: "SENSEX",
      value: 65930.77,
      change: 389.5,
      changePercent: 0.59,
      trendData: [65480, 65520, 65600, 65720, 65810, 65880, 65930],
    },
    {
      name: "BANK NIFTY",
      value: 44256.85,
      change: -125.4,
      changePercent: -0.28,
      trendData: [44450, 44420, 44380, 44350, 44310, 44280, 44256],
    },
  ];
};

/**
 * Fetches sector performance data
 * NOTE: Hardcoded locally for APK compatibility with existing HF deployment
 */
export const fetchSectorPerformance = async () => {
    return [
    { name: "IT", performance: 2.4, icon: "💻" },
    { name: "Banking", performance: 1.8, icon: "🏦" },
    { name: "Auto", performance: -0.5, icon: "🚗" },
    { name: "Pharma", performance: 3.2, icon: "💊" },
    { name: "Energy", performance: 1.1, icon: "⚡" },
    { name: "FMCG", performance: 0.3, icon: "🛒" },
    { name: "Metals", performance: -1.2, icon: "⚙️" },
    { name: "Realty", performance: 0.8, icon: "🏢" },
  ];
};

/**
 * Fetches lightweight stock data for quick card display
 * @param {string} ticker - Stock ticker symbol (e.g., "TCS.NS")
 * @returns {Promise<Object>} Basic stock data including end_price, price_change_pct, etc.
 */
export const fetchStockData = async (ticker) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/${ticker}/data`, {
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
/**
 * Fetches lightweight stock data for multiple tickers in parallel using batch API
 * @param {string[]} tickers - Array of stock ticker symbols
 * @returns {Promise<Object>} Object mapping ticker to stock data
 */
/**
 * Fetches lightweight stock data for multiple tickers in parallel
 * Restored to client-side Promise.all because HF deployment lacks batch endpoint
 */
export const fetchMultipleStockData = async (tickers) => {
  try {
    const promises = tickers.map(ticker => 
        fetchStockData(ticker).catch(err => {
            console.error(`Failed to load ${ticker}`, err);
            return null;
        })
    );
    
    // Execute all requests in parallel
    const results = await Promise.all(promises);
    
    // Map results back to an object { "TCS.NS": data, ... }
    const stocksMap = {};
    results.forEach((data, index) => {
        if (data) {
            stocksMap[tickers[index]] = data;
        }
    });
    
    return stocksMap;
  } catch (error) {
    console.error("Error fetching multiple stock data:", error);
    return {};
  }
};

/**
 * Fetches historical stock data for candlestick chart
 * @param {string} ticker - Stock ticker symbol (e.g., "TCS.NS")
 * @param {string} period - Period for data (default: "1mo")
 * @returns {Promise<Object>} Historical stock data
 */
export const fetchStockHistorical = async (ticker, period = "1mo") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/stocks/${ticker}/historical?period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch historical stock data for ${ticker}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching historical stock data for ${ticker}:`, error);
    throw error;
  }
};

/**
 * Fetches Nifty 50 historical data
 * @param {string} period - Period for data (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @returns {Promise<Object>} Nifty 50 historical data
 */
export const fetchNifty50Historical = async (period = "1mo") => {
  return fetchWithCache(`nifty50_${period}`, async () => {
    try {
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
        throw new Error(
            `Failed to fetch Nifty 50 historical data: ${response.statusText}`
        );
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching Nifty 50 historical data:", error);
        throw error;
    }
  });
};

/**
 * Fetches Sensex historical data
 * @param {string} period - Period for data (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @returns {Promise<Object>} Sensex historical data
 */
export const fetchSensexHistorical = async (period = "1mo") => {
  return fetchWithCache(`sensex_${period}`, async () => {
    try {
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
        throw new Error(
            `Failed to fetch Sensex historical data: ${response.statusText}`
        );
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching Sensex historical data:", error);
        throw error;
    }
  });
};

/**
 * Fetches Bank Nifty historical data
 * @param {string} period - Period for data (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @returns {Promise<Object>} Bank Nifty historical data
 */
export const fetchBankNiftyHistorical = async (period = "1mo") => {
  return fetchWithCache(`banknifty_${period}`, async () => {
    try {
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
        throw new Error(
            `Failed to fetch Bank Nifty historical data: ${response.statusText}`
        );
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching Bank Nifty historical data:", error);
        throw error;
    }
  });
};
