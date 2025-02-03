
const { MongoClient } = require("mongodb");
const { dbURL, dbName } = require("../config");

const client = new MongoClient(dbURL, { useUnifiedTopology: true });

let db;

async function Connect() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(dbName);
      await db.collection("users").createIndex({ email: 1 }, { unique: true });
      console.log(`Connected to MongoDB: ${dbName}`);
    } catch (error) {
      console.error(" MongoDB Connection Error:", error);
      process.exit(1);
    }
  }
  return db;
}

module.exports = Connect;
