// Stocks API Service
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

/**
 * Fetch available stock tickers
 * @returns {Promise<Object>} Tickers data
 */
export const fetchTickers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickers`);

    if (!response.ok) {
      throw new Error("Failed to fetch tickers");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tickers:", error);
    throw error;
  }
};

/**
 * Fetch stock data for a specific ticker
 * @param {string} ticker - Stock ticker symbol
 * @returns {Promise<Object>} Stock data
 */
export const fetchStockData = async (ticker) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/stocks/${ticker}/data`);

    if (!response.ok) {
      throw new Error(`Failed to fetch stock data for ${ticker}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching stock data for ${ticker}:`, error);
    throw error;
  }
};

/**
 * Generate case study for a ticker
 * @param {string} ticker - Stock ticker symbol
 * @param {string} companyName - Optional company name
 * @param {boolean} useFinbert - Use FinBERT model
 * @param {boolean} useGroq - Use Groq model
 * @returns {Promise<Object>} Case study data
 */
export const generateCaseStudy = async (
  ticker,
  companyName = null,
  useFinbert = true,
  useGroq = true
) => {
  try {
    const requestBody = {
      ticker,
      company_name: companyName || ticker,
      use_finbert: useFinbert,
      use_groq: useGroq,
    };
    console.log(
      "Frontend Service sending to Backend:",
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
        `Failed to generate case study for ${ticker}: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error generating case study for ${ticker}:`, error);
    throw error;
  }
};

/**
 * Generate batch case studies for multiple tickers
 * @param {Array<string>} tickers - Array of stock ticker symbols
 * @param {boolean} useFinbert - Use FinBERT model
 * @param {boolean} useGroq - Use Groq model
 * @returns {Promise<Object>} Batch case study data
 */
export const generateBatchCaseStudy = async (
  tickers,
  useFinbert = false,
  useGroq = false
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/case-study/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tickers,
        use_finbert: true,
        use_groq: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to generate batch case studies: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating batch case studies:", error);
    throw error;
  }
};
