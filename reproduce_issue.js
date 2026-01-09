const fetch = require('node-fetch');

const API_BASE_URL = "http://localhost:5000/api";

async function testGenerateCaseStudy() {
  const requestBody = {
    ticker: "RELIANCE.NS",
    company_name: "Reliance Industries",
    use_finbert: true,
    use_groq: true,
  };

  console.log("Sending request:", JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/case-study`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: ${response.status} ${response.statusText}`);
      console.error("Response body:", errorText);
    } else {
      const data = await response.json();
      console.log("Success:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

testGenerateCaseStudy();
