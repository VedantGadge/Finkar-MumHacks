// Receipt Scanning API Service
const API_BASE_URL = "https://lamaq-finkar-backend-teamayu.hf.space/api";

// Helper to get current user ID from localStorage
export const getCurrentUserId = () => {
    const userId = localStorage.getItem('finkar_user_id');
    return userId ? parseInt(userId, 10) : 1; // Default to 1 for demo/fallback
};

/**
 * Scan receipt image and save transaction
 * @param {number} userId - User ID
 * @param {File|Blob} imageFile - The captured image file
 * @returns {Promise<Object>} Scanned receipt data and saved transaction info
 */
export const scanAndSaveReceipt = async (userId, imageFile) => {
    try {
        // Create FormData with file
        const formData = new FormData();
        formData.append('file', imageFile, 'receipt.jpg');
        
        console.log('Sending request with user_id:', userId);

        // user_id goes as query parameter, file goes as form data
        const response = await fetch(`${API_BASE_URL}/receipt/scan-and-save?user_id=${userId}`, {
            method: 'POST',
            body: formData,
        });

        // Log raw response for debugging
        const responseText = await response.text();
        console.log('API Response Status:', response.status);
        console.log('API Response Body:', responseText);

        if (!response.ok) {
            let errorData = {};
            try {
                errorData = JSON.parse(responseText);
            } catch (e) {
                throw new Error(`Server error: ${responseText || response.statusText}`);
            }
            
            // Handle FastAPI validation errors (array of objects with loc, msg, type)
            if (errorData.detail && Array.isArray(errorData.detail)) {
                const errorMessages = errorData.detail.map(err => 
                    `${err.loc?.join('.') || 'field'}: ${err.msg}`
                ).join(', ');
                throw new Error(errorMessages);
            }
            
            throw new Error(errorData.detail || errorData.message || 'Failed to scan and save receipt');
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error('Error scanning receipt:', error);
        throw error;
    }
};
