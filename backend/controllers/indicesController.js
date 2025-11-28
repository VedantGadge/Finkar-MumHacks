const { API_BASE_URL } = require("../config/constants");

// GET /api/v1/indices/nifty50/historical - Get Nifty 50 historical data
const getNifty50Historical = async (req, res) => {
  try {
    const { period = "1mo" } = req.query;

    console.log(`Fetching Nifty 50 historical data for period: ${period}...`);

    const response = await fetch(
      `${API_BASE_URL}/indices/nifty50/historical?period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `External API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`Successfully fetched Nifty 50 historical data`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching Nifty 50 historical data:", error);
    res.status(500).json({
      error: "Failed to fetch Nifty 50 historical data",
      message: error.message,
    });
  }
};

// GET /api/v1/indices/sensex/historical - Get Sensex historical data
const getSensexHistorical = async (req, res) => {
  try {
    const { period = "1mo" } = req.query;

    console.log(`Fetching Sensex historical data for period: ${period}...`);

    const response = await fetch(
      `${API_BASE_URL}/indices/sensex/historical?period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `External API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`Successfully fetched Sensex historical data`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching Sensex historical data:", error);
    res.status(500).json({
      error: "Failed to fetch Sensex historical data",
      message: error.message,
    });
  }
};

// GET /api/v1/indices/banknifty/historical - Get Bank Nifty historical data
const getBankNiftyHistorical = async (req, res) => {
  try {
    const { period = "1mo" } = req.query;

    console.log(`Fetching Bank Nifty historical data for period: ${period}...`);

    const response = await fetch(
      `${API_BASE_URL}/indices/banknifty/historical?period=${period}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `External API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`Successfully fetched Bank Nifty historical data`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching Bank Nifty historical data:", error);
    res.status(500).json({
      error: "Failed to fetch Bank Nifty historical data",
      message: error.message,
    });
  }
};

module.exports = {
  getNifty50Historical,
  getSensexHistorical,
  getBankNiftyHistorical,
};
