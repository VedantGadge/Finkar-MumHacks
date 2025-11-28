/**
 * Translation Service
 * Provides Hindi to English translation using LibreTranslate API (free) or Google Translate API
 */

// Using MyMemory Translation API (free, no API key required)
const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

/**
 * Translate text from Hindi to English using MyMemory API
 * @param {string} text - The Hindi text to translate
 * @returns {Promise<string>} - The translated English text
 */
export const translateHindiToEnglish = async (text) => {
    if (!text || text.trim() === '') {
        return text;
    }

    try {
        const response = await fetch(
            `${MYMEMORY_API_URL}?q=${encodeURIComponent(text)}&langpair=hi|en`
        );

        if (!response.ok) {
            throw new Error('Translation API request failed');
        }

        const data = await response.json();

        if (data.responseStatus === 200 && data.responseData?.translatedText) {
            return data.responseData.translatedText;
        }

        // If translation fails, return original text
        console.warn('Translation returned unexpected format:', data);
        return text;
    } catch (error) {
        console.error('Translation error:', error);
        // Return original text if translation fails
        return text;
    }
};

/**
 * Detect if text contains Hindi characters (Devanagari script)
 * @param {string} text - Text to check
 * @returns {boolean} - True if text contains Hindi characters
 */
export const containsHindi = (text) => {
    // Devanagari Unicode range: \u0900-\u097F
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(text);
};

/**
 * Auto-translate text if it contains Hindi
 * @param {string} text - Text to potentially translate
 * @returns {Promise<{originalText: string, translatedText: string, wasTranslated: boolean}>}
 */
export const autoTranslate = async (text) => {
    const hasHindi = containsHindi(text);
    
    if (hasHindi) {
        const translatedText = await translateHindiToEnglish(text);
        return {
            originalText: text,
            translatedText,
            wasTranslated: true
        };
    }

    return {
        originalText: text,
        translatedText: text,
        wasTranslated: false
    };
};
