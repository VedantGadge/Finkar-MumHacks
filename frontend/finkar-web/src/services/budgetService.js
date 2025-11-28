// Budget API Service
const API_BASE_URL = "https://lamaq-financial-guardian-backend.hf.space/api";

/**
 * Fetch budgets for a user
 * @param {number} userId - User ID
 * @param {string} month - Optional month in YYYY-MM format
 * @returns {Promise<Object>} Budget data
 */
export const fetchBudgets = async (userId, month = null) => {
  try {
    const url = new URL(`${API_BASE_URL}/budgets`);
    url.searchParams.append("user_id", userId);
    if (month) {
      url.searchParams.append("month", month);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch budget data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }
};

/**
 * Create a new budget
 * @param {number} userId - User ID
 * @param {string} category - Budget category
 * @param {number} amount - Budget amount
 * @param {string} month - Month in YYYY-MM format
 * @returns {Promise<Object>} Created budget data
 */
export const createBudget = async (userId, category, amount, month) => {
  try {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        category,
        amount,
        month,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create budget");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};

/**
 * Update an existing budget
 * @param {number} userId - User ID
 * @param {string} category - Budget category
 * @param {number} amount - Budget amount
 * @param {string} month - Month in YYYY-MM format
 * @returns {Promise<Object>} Updated budget data
 */
export const updateBudget = async (userId, category, amount, month) => {
  try {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        category,
        amount,
        month,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update budget");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating budget:", error);
    throw error;
  }
};

/**
 * Delete a budget
 * @param {string} category - Budget category (path parameter)
 * @param {number} userId - User ID (query parameter)
 * @param {string} month - Optional month in YYYY-MM format (query parameter)
 * @returns {Promise<Object>} Deletion response
 */
export const deleteBudget = async (category, userId, month = null) => {
  try {
    const url = new URL(
      `${API_BASE_URL}/budgets/${encodeURIComponent(category)}`
    );
    url.searchParams.append("user_id", userId);
    if (month) {
      url.searchParams.append("month", month);
    }

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete budget");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw error;
  }
};
