const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "event_manager_db";

let client;
let db;

async function connectDB() {
  if (db) return db;
  client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("Connected to MongoDB:", MONGO_URI, "db:", DB_NAME);
  return db;
}

function getDB() {
  if (!db) throw new Error("Database not initialized.");
  return db;
}

module.exports = { connectDB, getDB };
