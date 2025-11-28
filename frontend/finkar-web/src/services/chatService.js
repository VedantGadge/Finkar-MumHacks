// Chat API Service
const API_BASE_URL = "https://lamaq-financial-guardian-backend.hf.space/api";

/**
 * Send a message to the chat API
 * @param {string} sessionId - Session ID
 * @param {string} phoneNumber - User's phone number
 * @param {string} message - Message text
 * @returns {Promise<Object>} Chat response
 */
export const sendMessage = async (sessionId, phoneNumber, message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        phone_number: phoneNumber,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
