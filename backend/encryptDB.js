const sqlite3 = require("@journeyapps/sqlcipher").verbose();

const SOURCE_DB = "finance_guardian.db";
const ENCRYPTED_DB = "finance_encrypted.db";
const DB_KEY = process.env.SQLCIPHER_KEY; // NEVER hardcode

if (!DB_KEY) {
  console.error("Error: SQLCIPHER_KEY environment variable is not set");
  process.exit(1);
}

const source = new sqlite3.Database(SOURCE_DB, (err) => {
  if (err) {
    console.error("Error opening source database:", err.message);
    process.exit(1);
  }
  console.log("Source database opened");
});

source.serialize(() => {
  // Attach the encrypted database with encryption key
  source.run(`ATTACH DATABASE '${ENCRYPTED_DB}' AS encrypted KEY '${DB_KEY}'`, (err) => {
    if (err) {
      console.error("Error attaching encrypted database:", err.message);
      process.exit(1);
    }
    console.log("Encrypted database attached");
  });

  // Export the data to the encrypted database
  source.run(`SELECT sqlcipher_export('encrypted')`, (err) => {
    if (err) {
      console.error("Error exporting to encrypted database:", err.message);
      process.exit(1);
    }
    console.log("Data exported to encrypted database");
  });

  // Detach the encrypted database
  source.run(`DETACH DATABASE encrypted`, (err) => {
    if (err) {
      console.error("Encryption failed:", err.message);
      process.exit(1);
    } else {
      console.log("Database encrypted successfully");
      source.close();
    }
  });
});
