const NodeCache = require("node-cache");

// Standard TTL: 5 minutes (300 seconds)
// Check period: 60 seconds (delete expired keys every 60s)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

module.exports = cache;
