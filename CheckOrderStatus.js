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

    // upstream_input_raw
    await client.query(`
      CREATE TABLE IF NOT EXISTS co_upstream_input_raw (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        rawData JSONB NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        rawResponse JSONB NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // upstream_input_formatted
    await client.query(`
      CREATE TABLE IF NOT EXISTS co_upstream_input_formatted (
        uuid UUID DEFAULT gen_random_uuid(),
        rawUuid VARCHAR(255) NULL,
        appId VARCHAR(255) NULL,
        serviceType VARCHAR(255) NULL,
        orderNumbers VARCHAR(255) NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        state VARCHAR(50) NULL,
        responseCode VARCHAR(10) NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // inv_base_req
    await client.query(`
      CREATE TABLE IF NOT EXISTS co_base_req (
        uuid UUID DEFAULT gen_random_uuid(),
        uuid_upstream VARCHAR(255) NULL,
        uuid_bizparam VARCHAR(255) NULL,
        appId VARCHAR(255) NULL,
        serviceType VARCHAR(255) NULL,
        bizParam TEXT NULL,
        timestamp TEXT NULL,
        sign TEXT NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        state VARCHAR(50) NULL,
        errorCode VARCHAR(50) NULL,
        errorMsg TEXT NULL,
        bizContent TEXT NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // inv_biz_param
    await client.query(`
      CREATE TABLE IF NOT EXISTS co_biz_param (
        uuid UUID DEFAULT gen_random_uuid(),
        orderNumbers VARCHAR(255) NOT NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // inv_biz_content_result
    await client.query(`
      CREATE TABLE IF NOT EXISTS co_biz_content_result (
        uuid UUID DEFAULT gen_random_uuid(),
        base_req_uuid VARCHAR(255) NULL,
        orderNumber VARCHAR(255) NULL,
        onlineOrderNumber VARCHAR(255) NULL,
        warehouse VARCHAR(255) NULL,
        status VARCHAR(255) NULL,
        carrier VARCHAR(255) NULL,
        trackingNumber VARCHAR(255) NULL,
        state VARCHAR(50) NULL,
        wmsStatus VARCHAR(255) NULL,
        platform VARCHAR(255) NULL,
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ All tables created successfully!");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  } finally {
    await client.end();
  }
}
// connectDB();
createTables();

module.exports = client;
