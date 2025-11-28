// Market API Service
const API_BASE_URL = "http://localhost:5000/api";

/**
 * Fetch market indices data
 * @returns {Promise<Array>} Market indices data
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
    throw error;
  }
};

/**
 * Fetch sector performance data
 * @returns {Promise<Array>} Sector performance data
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
    throw error;
  }
};
