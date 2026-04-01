const { MongoClient } = require('mongodb');
require('dotenv').config();

async function clearDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Error: MONGODB_URI is missing in .env");
    process.exit(1);
  }
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected directly to MongoDB");
    const db = client.db();
    
    // drop the sensordatas collection
    await db.collection("sensordatas").drop();
    console.log("Dropped sensordatas collection successfully!");
  } catch (err) {
    console.error("Error dropping collection:", err.message);
  } finally {
    await client.close();
  }
}

clearDB();
