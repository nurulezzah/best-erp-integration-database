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

    // downstream_input_raw
    await client.query(`
      CREATE TABLE IF NOT EXISTS founderhq_inv_downstream_input_raw (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        rawData JSONB NULL,
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        rawResponse JSONB NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // downstream_input_formatted
    await client.query(`
      CREATE TABLE IF NOT EXISTS founderhq_inv_downstream_input_formatted (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        rawUuid VARCHAR(255) NULL,
        sku VARCHAR(255) NULL,
        client VARCHAR(255) NULL,
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        state VARCHAR(50) NULL,
        responseCode VARCHAR(10) NULL,
        response_date TIMESTAMP NULL
      );
    `);


    // so_downstream_output_formatted
    await client.query(`
      CREATE TABLE IF NOT EXISTS founderhq_so_downstream_output_formatted (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        downstream_input_uuid VARCHAR(255) NULL,
        appId VARCHAR(255) NULL,
        serviceType VARCHAR(255) NULL,
        sku VARCHAR(255) NULL,
        warehouse VARCHAR(255) NULL,
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        state VARCHAR(50) NULL,
        responseCode VARCHAR(10) NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // downstream_input_raw
    await client.query(`
      CREATE TABLE IF NOT EXISTS founderhq_inv_downstream_output_raw (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        downstream_output_uuid VARCHAR(255) NULL,
        rawData JSONB NULL,
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        rawResponse JSONB NULL,
        response_date TIMESTAMP NULL
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