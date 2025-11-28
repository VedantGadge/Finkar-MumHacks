import { API_URL } from "../config";
// Goals API Service
// const API_BASE_URL = "https://lamaq-finkar-backend-teamayu.hf.space/api";

/**
 * Fetch goals for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of goals
 */
export const fetchGoals = async (userId) => {
  try {
    const url = new URL(`${API_URL}/goals`);
    url.searchParams.append("user_id", userId);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch goals data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw error;
  }
};

/**
 * Create a new goal
 * @param {number} userId - User ID
 * @param {string} name - Goal name
 * @param {number} targetAmount - Target amount
 * @param {string} targetDate - Target date
 * @returns {Promise<Object>} Created goal data
 */
export const createGoal = async (userId, name, targetAmount, targetDate) => {
  try {
    const response = await fetch(`${API_URL}/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        name,
        target_amount: targetAmount,
        target_date: targetDate,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create goal");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating goal:", error);
    throw error;
  }
};
