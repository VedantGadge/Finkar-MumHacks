const { API_BASE_URL } = require("../config/constants");

// POST /api/case-study - Generate case study for a ticker
const generateCaseStudy = async (req, res) => {
  try {
    const { ticker, company_name, use_finbert, use_groq } = req.body;

    if (!ticker) {
      return res.status(400).json({
        error: "Ticker is required",
      });
    }

    console.log(`Generating case study for ${ticker}...`);
    console.log("Incoming Request Body:", JSON.stringify(req.body, null, 2));

    const requestBody = {
      ticker,
      company_name: "string",
      use_finbert: true,
      use_groq: true,
    };

    console.log("Sending to External API:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${API_BASE_URL}/case-study/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HuggingFace API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error(
        "Failed to parse JSON response:",
        responseText.substring(0, 200)
      );
      throw new Error(`Invalid JSON response from API: ${e.message}`);
    }

    console.log(`Successfully generated case study for ${ticker}`);
    console.log("External API Response Data:", JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error("Error generating case study:", error);
    res.status(500).json({
      error: "Failed to generate case study",
      message: error.message,
    });
  }
};

// POST /api/case-study/batch - Generate case studies for multiple tickers
const generateBatchCaseStudy = async (req, res) => {
  try {
    const { tickers, use_finbert, use_groq } = req.body;

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return res.status(400).json({
        error: "Tickers array is required and must not be empty",
      });
    }

    console.log(
      `Initiating batch case study generation for ${tickers.length} tickers...`
    );
    console.log("Incoming Request Body:", JSON.stringify(req.body, null, 2));

    const requestBody = {
      tickers,
      use_finbert: true,
      use_groq: true,
    };

    console.log("Sending to External API:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${API_BASE_URL}/case-study/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HuggingFace API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error(
        "Failed to parse JSON response:",
        responseText.substring(0, 200)
      );
      throw new Error(`Invalid JSON response from API: ${e.message}`);
    }

    console.log(`Batch case study generation initiated successfully`);
    res.json(data);
  } catch (error) {
    console.error("Error initiating batch case study generation:", error);
    res.status(500).json({
      error: "Failed to initiate batch case study generation",
      message: error.message,
    });
  }
};

module.exports = {
  generateCaseStudy,
  generateBatchCaseStudy,
};
