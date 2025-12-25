const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export const loginUser = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) throw new Error("Login failed");
    return await response.json();
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getUserProfile = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${username}`);
    if (!response.ok) throw new Error("Failed to fetch profile");
    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const buyStock = async (username, ticker, quantity, price) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, ticker, quantity, price }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Buy failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Error buying stock:", error);
    throw error;
  }
};

export const sellStock = async (username, ticker, quantity, price) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/sell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, ticker, quantity, price }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Sell failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Error selling stock:", error);
    throw error;
  }
};

export const awardFinkirks = async (username, amount, reason) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/award`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, amount, reason }),
    });
    if (!response.ok) throw new Error("Award failed");
    return await response.json();
  } catch (error) {
    console.error("Error awarding finkirks:", error);
    throw error;
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/leaderboard`);
    if (!response.ok) throw new Error("Failed to fetch leaderboard");
    return await response.json();
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};

export const getPortfolioSummary = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/portfolio/${username}`);
    if (!response.ok) throw new Error("Failed to fetch portfolio summary");
    return await response.json();
  } catch (error) {
    console.error("Error fetching portfolio summary:", error);
    throw error;
  }
};

export const getPortfolioHistory = async (username, period = "1M") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/portfolio/${username}/history?period=${period}`
    );
    if (!response.ok) throw new Error("Failed to fetch portfolio history");
    return await response.json();
  } catch (error) {
    console.error("Error fetching portfolio history:", error);
    throw error;
  }
};
