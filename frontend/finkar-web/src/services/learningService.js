import axios from 'axios';

// Hardcoded API URL as requested to strictly use HF Space
const API_URL = "https://lamaq-finkar-backend-teamayu.hf.space/api";

/**
 * Fetch personalized daily learning cards for a user
 * @param {number} userId - The user's ID
 * @returns {Promise<Object>} - The daily learning data including date and cards
 */
export const fetchDailyLearning = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/learning/daily`, {
            params: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching daily learning cards:', error);
        throw error;
    }
};
