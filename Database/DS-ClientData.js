require('dotenv').config();
const { Client } = require('pg');

// Create a client with your DB connection info
const client = new Client({
  user: process.env.DB_USER,       // 🔹 replace with your PostgreSQL username
  host: process.env.DB_HOST,      // 🔹 where your DB is running
  database: process.env.DB_NAME,  // 🔹 your database name
  password: process.env.DB_PASSWORD, // 🔹 replace with your password
  port: process.env.DB_PORT,             // 🔹 default port
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL database:", client.database);
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
}

async function createTables() {
    try {
    await client.connect();

    // client_data
    await client.query(`
      CREATE TABLE IF NOT EXISTS client_data (
        client VARCHAR(255) NULL,
        shop VARCHAR(255) NULL,
        warehouse VARCHAR(255) NULL
      );
    `);
   

    console.log("✅ All tables created successfully!");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  } finally {
    await client.end();
  }
}

createTables();

module.exports = client;