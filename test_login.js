const fetch = require('node-fetch');

const API_BASE_URL = "http://127.0.0.1:5000/api";

async function testLogin() {
  const username = "TestUser_" + Math.floor(Math.random() * 1000);
  console.log(`Testing login with username: ${username}`);

  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Login Successful:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testLogin();
