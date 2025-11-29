// Liabilities API Service
const API_BASE_URL = "https://lamaq-finkar-backend-teamayu.hf.space/api";

// Helper to get current user ID from localStorage
export const getCurrentUserId = () => {
    const userId = localStorage.getItem('finkar_user_id');
    return userId ? parseInt(userId, 10) : 1; // Default to 1 for demo/fallback
};

/**
 * Fetch liabilities (loans and credit cards) for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Liabilities data including total_liability, loans, and credit_cards
 */
export const fetchLiabilities = async (userId) => {
  try {
    const url = new URL(`${API_BASE_URL}/liabilities`);
    url.searchParams.append("user_id", userId);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch liabilities data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching liabilities:", error);
    throw error;
  }
};
