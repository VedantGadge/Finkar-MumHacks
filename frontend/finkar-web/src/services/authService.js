const API_BASE_URL = 'https://lamaq-finkar-backend-teamayu.hf.space';

/**
 * Generate OTP for the given mobile number
 * @param {string} mobileNumber - The mobile number to send OTP to
 * @returns {Promise<object>} - API response
 */
export const generateOTP = async (mobileNumber) => {
    const response = await fetch(`${API_BASE_URL}/api/simulation/otp/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile_number: mobileNumber }),
    });

    if (!response.ok) {
        throw new Error('Failed to generate OTP');
    }

    return response.json();
};

/**
 * Verify OTP for the given mobile number
 * @param {string} mobileNumber - The mobile number
 * @param {string} otp - The OTP to verify
 * @returns {Promise<object>} - API response
 */
export const verifyOTP = async (mobileNumber, otp) => {
    const response = await fetch(`${API_BASE_URL}/api/simulation/otp/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile_number: mobileNumber, otp }),
    });

    if (!response.ok) {
        throw new Error('Invalid OTP');
    }

    return response.json();
};

/**
 * Fetch available FIPs (Financial Information Providers / Banks)
 * @returns {Promise<object>} - API response with list of FIPs
 */
export const fetchFIPs = async () => {
    const response = await fetch(`${API_BASE_URL}/api/simulation/fips`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch banks');
    }

    return response.json();
};

/**
 * Approve consent for selected banks
 * @param {string} mobileNumber - The mobile number
 * @param {string[]} selectedBanks - Array of selected bank IDs
 * @returns {Promise<object>} - API response
 */
export const approveConsent = async (mobileNumber, selectedBanks) => {
    const response = await fetch(`${API_BASE_URL}/api/simulation/consent/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile_number: mobileNumber, selected_banks: selectedBanks }),
    });

    if (!response.ok) {
        throw new Error('Failed to approve consent');
    }

    return response.json();
};

/**
 * Initiate Setu Consent for linking actual bank account
 * @param {string} mobileNumber - The mobile number
 * @param {string} redirectUrl - The URL to redirect back to after consent
 * @returns {Promise<object>} - API response containing consent_id and url
 */
export const initiateSetuConsent = async (mobileNumber, redirectUrl) => {
    const response = await fetch(`${API_BASE_URL}/api/setu/consent/initiate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mobile_number: mobileNumber,
            redirect_url: redirectUrl
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to initiate Setu consent');
    }

    return response.json();
};

/**
 * Check the status of a Setu consent
 * @param {string} consentId - The consent ID to check
 * @returns {Promise<object>} - API response with status
 */
export const getConsentStatus = async (consentId) => {
    const response = await fetch(`${API_BASE_URL}/api/setu/consent/${consentId}/status`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch consent status');
    }

    return response.json();
};
