// Score API Service
const API_BASE_URL = "https://lamaq-finkar-backend-teamayu.hf.space/api";

/**
 * Fetch user's financial score
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} Financial score data
 */
export const fetchFinancialScore = async (userId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/score/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch financial score");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching financial score:", error);
    throw error;
  }
};
