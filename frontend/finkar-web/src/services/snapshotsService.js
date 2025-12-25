// Snapshots API Service
const API_BASE_URL = "https://lamaq-finkar-backend-teamayu.hf.space/api";

/**
 * Fetch all monthly snapshots for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of monthly snapshot objects with metrics and analysis
 */
export const fetchSnapshots = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/snapshots/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch snapshots");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching snapshots:", error);
    throw error;
  }
};
