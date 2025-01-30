const { MongoClient } = require("mongodb");
const {dbURL,dbName} = require('../config');

  const client = new MongoClient(dbURL, { useUnifiedTopology: true, useNewUrlParser: true });

  function Connect() {
    return new Promise(async (resolve, reject) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const users = db.collection("users");
      users.createIndex({ email: 1 }, { unique: true });
      console.log("Connected to MongoDB!");
      resolve();
    } catch (error) {
      console.error("Error connecting to MongoDB", error);
      reject(error);
    }
  });
  }
  module.exports = Connect;