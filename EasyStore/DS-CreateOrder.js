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
      CREATE TABLE IF NOT EXISTS easystore_so_downstream_input_raw (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        rawData JSONB NULL,
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        rawResponse JSONB NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // easystore_so_downstream_input_formatted
    await client.query(`
      CREATE TABLE IF NOT EXISTS easystore_so_downstream_input_formatted (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        rawUuid VARCHAR(255) NULL,
        id INT NULL,
        token VARCHAR(255) NULL,
        number INT NULL,
        order_number VARCHAR(255) NULL,
        email VARCHAR(255) NULL,
        customer_id VARCHAR(255) NULL,
        customer JSONB NULL,
        currency_code VARCHAR(10) NULL,
        subtotal_price VARCHAR(255) NULL,
        total_discount VARCHAR(255) NULL,
        total_amount VARCHAR(255) NULL,
        total_shipping VARCHAR(255) NULL,
        total_price VARCHAR(255) NULL,
        financial_status VARCHAR(255) NULL,
        fulfillment_status VARCHAR(255) NULL,
        line_items JSONB NULL,
        shipping_address JSONB NULL,
        remark VARCHAR(255) NULL,
        note VARCHAR(255) NULL,
        cod_type INT NULL,
        location_id VARCHAR(255) NULL,
        fulfillments JSONB NULL,
        paid_at VARCHAR(255) NULL,
        order_created VARCHAR(255) NULL,
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        post_status VARCHAR(50) NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // easystore_so_customer
    await client.query(`
      CREATE TABLE IF NOT EXISTS easystore_so_customer (
        downstream_input_uuid VARCHAR(255) NULL,
        store_id INT NULL,
        email VARCHAR(255) NULL,
        first_name VARCHAR(255) NULL,
        last_name VARCHAR(255) NULL,
        phone VARCHAR(255) NULL,
        country_code VARCHAR(10) NULL,
        total_spent VARCHAR(255) NULL,
        total_order INT NULL,
        name VARCHAR(255) NULL,
        address1 VARCHAR(255) NULL,
        address2 VARCHAR(255) NULL,
        city VARCHAR(255) NULL,
        zip VARCHAR(255) NULL,
        sub_district VARCHAR(255) NULL,
        district VARCHAR(255) NULL,
        province VARCHAR(255) NULL,
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);


    // easystore_so_line_items
    await client.query(`
      CREATE TABLE IF NOT EXISTS easystore_so_line_items (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        downstream_input_uuid VARCHAR(255) NULL,
        order_id INT NULL,
        product_id INT NULL,
        product_name VARCHAR(255) NULL,
        sku VARCHAR(255) NULL,
        barcode VARCHAR(255) NULL,
        price VARCHAR(255) NULL,
        total_discount VARCHAR(255) NULL,
        quantity INT NULL,
        total_tax VARCHAR(255) NULL,
        total_amount VARCHAR(255) NULL,
        fulfillable_quantity INT NULL,
        fulfillment_service JSONB NULL,
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // easystore_so_shipping_address
    await client.query(`
      CREATE TABLE IF NOT EXISTS easystore_so_shipping_address (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        downstream_input_uuid VARCHAR(255) NULL,
        order_id INT NULL,
        first_name VARCHAR(255) NULL,
        last_name VARCHAR(255) NULL,
        address1 VARCHAR(255) NULL,
        address2 VARCHAR(255) NULL,
        city VARCHAR(255) NULL,
        zip VARCHAR(255) NULL,
        sub_district VARCHAR(255) NULL,
        district VARCHAR(255) NULL,
        province VARCHAR(255) NULL,
        country_code VARCHAR(10) NULL,
        phone VARCHAR(255) NULL,
        email VARCHAR(255) NULL,
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);


    // easystore_so_fulfillments
    await client.query(`
      CREATE TABLE IF NOT EXISTS easystore_so_fulfillments (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // so_downstream_output
    await client.query(`
      CREATE TABLE IF NOT EXISTS easystore_so_downstream_output (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        downstream_input_uuid VARCHAR(255) NULL,
        appId VARCHAR(255) NULL,
        serviceType VARCHAR(255) NULL,
        shop VARCHAR(255) NULL,
        onlineOrderNumber VARCHAR(255) NULL,
        paymentMethod VARCHAR(255) NULL,
        codPayAmount DECIMAL(10,2) NULL,
        payTime VARCHAR(255) NULL,
        sku JSONB NULL,
        receiverName VARCHAR(255) NULL,
        receiverPhone VARCHAR(255) NULL,
        receiverCountry VARCHAR(255) NULL,
        receiverProvince VARCHAR(255) NULL,
        receiverCity VARCHAR(255) NULL,
        receiverPostcode VARCHAR(255) NULL,
        receiverAddress VARCHAR(255) NULL,
        created_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        state VARCHAR(50) NULL,
        responseCode VARCHAR(10) NULL,
        response_date TIMESTAMP NULL
      );
    `);
   
    // easystore_so_output_sku
    await client.query(`
      CREATE TABLE IF NOT EXISTS easystore_so_output_sku (
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        downstream_input_uuid VARCHAR(255) NULL,
        sku VARCHAR(255) NULL,
        payAmount DECIMAL(10,2) NULL,
        quantity INT NULL,
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

createTables();

module.exports = client;