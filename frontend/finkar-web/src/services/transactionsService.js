// Transactions API Service
const API_BASE_URL = "https://lamaq-finkar-backend-teamayu.hf.space/api";

/**
 * Fetch all transactions for a user
 * @param {number} userId - User ID
 * @param {number} limit - Optional limit for number of transactions to fetch
 * @returns {Promise<Array>} Array of transactions
 */
export const fetchTransactions = async (userId, limit = null) => {
  try {
    const url = new URL(`${API_BASE_URL}/transactions`);
    url.searchParams.append("user_id", userId);
    if (limit) {
      url.searchParams.append("limit", limit);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

/**
 * Create a manual transaction
 * @param {number} userId - User ID
 * @param {number} amount - Transaction amount
 * @param {string} category - Transaction category
 * @param {string} narration - Transaction description/narration
 * @param {string} date - Transaction date (YYYY-MM-DD format)
 * @returns {Promise<Object>} Created transaction data
 */
export const createManualTransaction = async (userId, amount, category, narration, date) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        amount,
        category,
        narration,
        date,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create transaction");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};
