/**
 * Maps the API response for stock data to the format expected by the UI.
 *
 * @param {Object} apiData - The raw API response JSON.
 * @returns {Object} - The formatted stock object for the UI.
 */
export const mapApiToStockData = (apiData) => {
  if (!apiData) return null;

  // Extract lessons from markdown if available
  const lessons = extractLessonsFromMarkdown(apiData.markdown_output);

  return {
    ticker: apiData.ticker,
    symbol: apiData.ticker,
    name: apiData.company_name,
    sector: apiData.sector,
    industry: apiData.industry,
    signal:
      apiData.combined_analysis?.signal?.toUpperCase().replace(/_/g, " ") ||
      "NEUTRAL",
    signalStrength: apiData.combined_analysis?.signal_strength || "Moderate",
    confidence:
      apiData.combined_analysis?.confidence?.toLowerCase() || "medium",
    priceData: {
      starting: apiData.stock_data?.start_price || 0,
      current: apiData.stock_data?.end_price || 0,
      change: apiData.stock_data?.price_change || 0,
      changePercent: apiData.stock_data?.price_change_pct || 0,
      high: apiData.stock_data?.high_price || 0,
      low: apiData.stock_data?.low_price || 0,
      volatility: apiData.stock_data?.volatility || 0,
    },
    trend: apiData.price_analysis?.trend_label || "Neutral",
    sentiment: {
      overall:
        apiData.sentiment_data?.overall_sentiment?.toUpperCase() || "NEUTRAL",
      compound: apiData.sentiment_data?.avg_compound || 0,
      confidence: apiData.sentiment_data?.confidence || "medium",
      articlesAnalyzed: apiData.sentiment_data?.total_articles || 0,
      positive: apiData.sentiment_data?.positive_count || 0,
      negative: apiData.sentiment_data?.negative_count || 0,
      neutral: apiData.sentiment_data?.neutral_count || 0,
    },
    // Chart data is missing in API, so we set it to null to hide the chart
    chartData: null,
    lessons: lessons,
  };
};

/**
 * Parses the markdown output to extract "Practical Trading Wisdom" lessons.
 * Assumes a specific markdown structure with "### 💡 Practical Trading Wisdom" section.
 *
 * @param {string} markdown - The markdown content.
 * @returns {Array} - Array of lesson objects { title, description, tip }.
 */
const extractLessonsFromMarkdown = (markdown) => {
  if (!markdown) return [];

  const lessons = [];

  // Find the Practical Trading Wisdom section
  const sectionStart = markdown.indexOf("### 💡 Practical Trading Wisdom");
  if (sectionStart === -1) return [];

  // Find the end of the section (next ### or ---)
  const sectionContent = markdown.slice(sectionStart);
  const sectionEnd = sectionContent.indexOf("\n---", 10);
  const relevantContent =
    sectionEnd !== -1 ? sectionContent.slice(0, sectionEnd) : sectionContent;

  // Regex to match lessons in format:
  // #### Lesson N: Title
  // Content...
  // **Financial Literacy Tip:** Tip content
  const lessonRegex =
    /#### Lesson \d+: (.*?)\n([\s\S]*?)(?=#### Lesson \d+:|$)/g;

  let match;
  while ((match = lessonRegex.exec(relevantContent)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();

    // Extract the description (everything before the Financial Literacy Tip)
    const tipStart = content.indexOf("**Financial Literacy Tip:**");
    let description = "";
    let tip = "";

    if (tipStart !== -1) {
      description = content.slice(0, tipStart).trim();
      tip = content
        .slice(tipStart + "**Financial Literacy Tip:**".length)
        .trim();
    } else {
      description = content;
    }

    lessons.push({
      title: title,
      description: description,
      tip: tip || "Stay informed and make data-driven decisions.",
    });
  }

  return lessons;
};
