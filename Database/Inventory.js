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
      CREATE TABLE IF NOT EXISTS inv_upstream_input_raw (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        rawData JSONB NULL,
        created_date TIMESTAMP NULL,
        rawResponse JSONB NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // upstream_input_formatted
    await client.query(`
      CREATE TABLE IF NOT EXISTS inv_upstream_input_formatted (
        uuid UUID DEFAULT gen_random_uuid(),
        rawUuid VARCHAR(255) NULL,
        appId VARCHAR(255) NULL,
        serviceType VARCHAR(255) NULL,
        sku JSONB NOT NULL,
        warehouse VARCHAR(255) NULL,
        created_date TIMESTAMP NULL,
        state VARCHAR(50) NULL,
        responseCode VARCHAR(10) NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // inv_base_req
    await client.query(`
      CREATE TABLE IF NOT EXISTS inv_base_req (
        uuid UUID DEFAULT gen_random_uuid(),
        uuid_upstream VARCHAR(255) NULL,
        uuid_bizparam VARCHAR(255) NULL,
        appId VARCHAR(255) NULL,
        serviceType VARCHAR(255) NULL,
        bizParam TEXT NULL,
        timestamp TEXT NULL,
        sign TEXT NULL,
        created_date TIMESTAMP NULL,
        state VARCHAR(50) NULL,
        errorCode VARCHAR(50) NULL,
        errorMsg TEXT NULL,
        bizContent TEXT NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // inv_biz_param
    await client.query(`
      CREATE TABLE IF NOT EXISTS inv_biz_param (
        uuid UUID DEFAULT gen_random_uuid(),
        skuList JSONB NULL,
        warehouse VARCHAR(255) NOT NULL,
        page INT NOT NULL,
        pageSize INT NOT NULL,
        showCombine BOOLEAN NULL,
        showEmpty BOOLEAN NULL,
        originCurrency BOOLEAN NULL,
        fillCostAndGoods BOOLEAN NULL,
        created_date TIMESTAMP NULL
      );
    `);

    // inv_biz_content_result
    await client.query(`
      CREATE TABLE IF NOT EXISTS inv_biz_content_result (
        base_req_uuid VARCHAR(255) NULL,
        sku VARCHAR(255) NULL,
        skuName VARCHAR(255) NULL,
        warehouse VARCHAR(255) NULL,
        warehouseCode VARCHAR(255) NULL,
        total INT NULL,
        available INT NULL,
        allocated INT NULL,
        unavailable INT NULL,
        shippingQuantity INT NULL,
        purchaseShippingQuantity INT NULL,
        firstLegShippingQuantity INT NULL,
        transferShippingQuantity INT NULL,
        assemblyShippingQuantity INT NULL,
        returnShippingQuantity INT NULL,
        manualShippingQuantity INT NULL,
        orderAllocated INT NULL,
        firstLegAllocated INT NULL,
        transferAllocated INT NULL,
        assemblyAllocated INT NULL,
        totalCost INT NULL,
        availableCost INT NULL,
        unavailableCost INT NULL,
        allocatedCost INT NULL,
        shippingCost INT NULL,
        totalGoods INT NULL,
        unavailableGoods INT NULL,
        availableGoods INT NULL,
        allocatedGoods INT NULL,
        shippingGoods INT NULL,
        created_date TIMESTAMP NULL
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
