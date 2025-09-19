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
      CREATE TABLE IF NOT EXISTS inventory_upstream_input_raw (
        uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rawData JSONB,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        rawResponse JSONB,
        response_date TIMESTAMP
      );
    `);

    // upstream_input_formatted
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory_upstream_input_formatted (
        uuid UUID DEFAULT gen_random_uuid(),
        rawUuid VARCHAR(255),
        appId VARCHAR(255),
        serviceType VARCHAR(255),
        sku JSONB,
        warehouse VARCHAR(255),
        page INT,
        pageSize INT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        state VARCHAR(50),
        errorCode VARCHAR(100),
        errorMsg TEXT,
        response_date TIMESTAMP
      );
    `);

    // inventory_base_req
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory_base_req (
        uuid UUID DEFAULT gen_random_uuid(),
        rawUuid VARCHAR(255),
        appId VARCHAR(255),
        serviceType VARCHAR(255),
        bizParam TEXT,
        timestamp BIGINT,
        sign TEXT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        errorCode VARCHAR(50),
        errorMsg TEXT,
        state VARCHAR(50),
        bizContent TEXT,
        response_date TIMESTAMP
      );
    `);

    // inventory_biz_param
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory_biz_param (
        base_req_uuid VARCHAR(255),
        rawUuid VARCHAR(255),
        skuList JSONB,
        warehouse VARCHAR(255),
        page INT,
        pageSize INT,
        showCombine BOOLEAN,
        showEmpty BOOLEAN,
        originCurrency BOOLEAN,
        fillCostAndGoods BOOLEAN,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // inventory_biz_content_result
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory_biz_content_result (
        base_req_uuid VARCHAR(255),
        appId VARCHAR(255),
        sku VARCHAR(255),
        skuName VARCHAR(255),
        warehouse VARCHAR(255),
        warehouseCode VARCHAR(255),
        total INT,
        available INT,
        allocated INT,
        unavailable INT,
        shippingQuantity INT,
        purchaseShippingQuantity INT,
        firstLegShippingQuantity INT,
        transferShippingQuantity INT,
        assemblyShippingQuantity INT,
        returnShippingQuantity INT,
        manualShippingQuantity INT,
        orderAllocated INT,
        firstLegAllocated INT,
        transferAllocated INT,
        assemblyAllocated INT,
        totalCost INT,
        availableCost INT,
        unavailableCost INT,
        allocatedCost INT,
        shippingCost INT,
        totalGoods INT,
        unavailableGoods INT,
        availableGoods INT,
        allocatedGoods INT,
        shippingGoods INT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
