const LAMAQ_API_BASE_URL = "https://lamaq-finkar-backend-teamayu.hf.space/api";

// GET /api/score/:user_id - Fetch user's financial score
const getFinancialScore = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    console.log(`Fetching financial score for user ${user_id} from LLaMA API...`);
    
    const response = await fetch(`${LAMAQ_API_BASE_URL}/score/${user_id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `LLaMA API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    
    const data = await response.json();
    console.log(`Successfully fetched score for user ${user_id}`);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching financial score for user ${user_id}:`, error);
    res.status(500).json({
      error: "Failed to fetch financial score",
      message: error.message,
    });
  }
};

module.exports = {
  getFinancialScore,
};
