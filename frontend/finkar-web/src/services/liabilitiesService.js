import { API_URL } from "../config";
// Liabilities API Service
// const API_BASE_URL = "https://lamaq-finkar-backend-teamayu.hf.space/api";

/**
 * Fetch liabilities (loans and credit cards) for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Liabilities data including total_liability, loans, and credit_cards
 */
export const fetchLiabilities = async (userId) => {
  try {
    const url = new URL(`${API_URL}/liabilities`);
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
