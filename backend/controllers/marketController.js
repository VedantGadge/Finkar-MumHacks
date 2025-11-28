// GET /api/market-indices - Fetch market indices data
const getMarketIndices = (req, res) => {
  const marketIndices = [
    {
      name: "NIFTY 50",
      value: 19674.25,
      change: 142.3,
      changePercent: 0.73,
      trendData: [19520, 19545, 19580, 19610, 19635, 19650, 19674],
    },
    {
      name: "SENSEX",
      value: 65930.77,
      change: 389.5,
      changePercent: 0.59,
      trendData: [65480, 65520, 65600, 65720, 65810, 65880, 65930],
    },
    {
      name: "BANK NIFTY",
      value: 44256.85,
      change: -125.4,
      changePercent: -0.28,
      trendData: [44450, 44420, 44380, 44350, 44310, 44280, 44256],
    },
  ];
  res.json(marketIndices);
};

// GET /api/sector-performance - Fetch sector performance data
const getSectorPerformance = (req, res) => {
  const sectorPerformance = [
    { name: "IT", performance: 2.4, icon: "💻" },
    { name: "Banking", performance: 1.8, icon: "🏦" },
    { name: "Auto", performance: -0.5, icon: "🚗" },
    { name: "Pharma", performance: 3.2, icon: "💊" },
    { name: "Energy", performance: 1.1, icon: "⚡" },
    { name: "FMCG", performance: 0.3, icon: "🛒" },
    { name: "Metals", performance: -1.2, icon: "⚙️" },
    { name: "Realty", performance: 0.8, icon: "🏢" },
  ];
  res.json(sectorPerformance);
};

module.exports = {
  getMarketIndices,
  getSectorPerformance,
};
