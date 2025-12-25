/**
 * Technical Analysis Indicators
 */

/**
 * Calculates Simple Moving Average (SMA)
 * @param {Array<number>} data - Array of prices
 * @param {number} period - Window size (e.g., 20, 50, 200)
 * @returns {Array<number|null>} Array of SMA values matched to input data length (null padded)
 */
export const calculateSMA = (data, period) => {
    if (!data || data.length < period) return Array(data?.length || 0).fill(null);

    const sma = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            sma.push(null);
            continue;
        }

        const slice = data.slice(i - period + 1, i + 1);
        const sum = slice.reduce((a, b) => a + b, 0);
        sma.push(sum / period);
    }
    return sma;
};

/**
 * Calculates Exponential Moving Average (EMA)
 * @param {Array<number>} data - Array of prices
 * @param {number} period - Window size
 * @returns {Array<number|null>} EMA values
 */
export const calculateEMA = (data, period) => {
    if (!data || data.length < period) return Array(data?.length || 0).fill(null);

    const k = 2 / (period + 1);
    const ema = [data[0]]; // Start with first price (approximation) or use SMA for first point

    // Better: First EMA is SMA of first 'period' points
    // But for simplicity/speed in JS over long arrays, we often start simple or handle the nulls
    // To match SMA padding style:
    const results = Array(period - 1).fill(null);
    
    // Calculate initial SMA
    let sum = 0;
    for(let i=0; i<period; i++) sum += data[i];
    let prevEma = sum / period;
    results.push(prevEma);

    for (let i = period; i < data.length; i++) {
        const currentEma = (data[i] * k) + (prevEma * (1 - k));
        results.push(currentEma);
        prevEma = currentEma;
    }

    return results;
};

/**
 * Calculates Relative Strength Index (RSI)
 * @param {Array<number>} data - Array of prices (closing)
 * @param {number} period - RSI period, typically 14
 * @returns {Array<number|null>} RSI values
 */
export const calculateRSI = (data, period = 14) => {
    if (!data || data.length <= period) return Array(data?.length || 0).fill(null);

    const rsi = [];
    const gains = [];
    const losses = [];

    // Calculate initial gains and losses
    for (let i = 1; i < data.length; i++) {
        const diff = data[i] - data[i - 1];
        gains.push(Math.max(diff, 0));
        losses.push(Math.max(-diff, 0));
    }

    // Calculate initial average gain and loss
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

    // Pad the beginning
    for (let i = 0; i < period; i++) {
        rsi.push(null);
    }

    // First RSI
    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));

    // Remaining RSI
    for (let i = period + 1; i < data.length; i++) {
        const diff = data[i] - data[i - 1];
        const gain = Math.max(diff, 0);
        const loss = Math.max(-diff, 0);

        avgGain = ((avgGain * (period - 1)) + gain) / period;
        avgLoss = ((avgLoss * (period - 1)) + loss) / period;

        rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
    }

    return rsi;
};

/**
 * Calculates Bollinger Bands
 * @param {Array<number>} data - Array of prices
 * @param {number} period - SMA period (standard 20)
 * @param {number} stdDevMultiplier - Standard deviation multiplier (standard 2)
 * @returns {Object} { upper: [], middle: [], lower: [] } arrays
 */
export const calculateBollingerBands = (data, period = 20, stdDevMultiplier = 2) => {
    if (!data || data.length < period) {
        const empty = Array(data?.length || 0).fill(null);
        return { upper: empty, middle: empty, lower: empty };
    }

    const upper = [];
    const middle = [];
    const lower = [];

    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            upper.push(null);
            middle.push(null);
            lower.push(null);
            continue;
        }

        const slice = data.slice(i - period + 1, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / period;
        
        // Standard Deviation
        const squaredDiffs = slice.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
        const stdDev = Math.sqrt(variance);

        middle.push(mean);
        upper.push(mean + (stdDev * stdDevMultiplier));
        lower.push(mean - (stdDev * stdDevMultiplier));
    }

    return { upper, middle, lower };
};
