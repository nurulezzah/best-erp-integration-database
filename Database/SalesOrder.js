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


async function createTables() {
  try {
    await client.connect();

    // upstream_input_raw
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_upstream_input_raw (
        uuid UUID DEFAULT gen_random_uuid(),
        rawData JSONB,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        rawResponse JSONB,
        response_date TIMESTAMP
      );
    `);

    // upstream_input_formatted
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_upstream_input_formatted (
        uuid UUID DEFAULT gen_random_uuid(),
        rawUuid VARCHAR(255),
        appId VARCHAR(255),
        serviceType VARCHAR(255),
        onlineOrderNumber VARCHAR(255),
        paymentMethod VARCHAR(255),
        codPayAmount DECIMAL(5,4),
        payTime VARCHAR(255),
        sku JSONB,
        receiverName VARCHAR(255),
        receiverPhone VARCHAR(255),
        receiverCountry VARCHAR(255),
        receiverProvince VARCHAR(255),
        receiverCity VARCHAR(255),
        receiverPostcode VARCHAR(255),
        receiverAddress TEXT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        state VARCHAR(50),
        errorCode VARCHAR(100),
        errorMsg TEXT,
        response_date TIMESTAMP
      );
    `);

    //upstream_input_formatted_sku
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_upstream_input_formatted_sku (
        upstream_formatted_uuid VARCHAR(255),
        onlineOrderNumber VARCHAR(255),
        appId VARCHAR(255),
        sku VARCHAR(255),
        payAmount DECIMAL(5,4),
        paymentPrice DECIMAL(5,4),
        quantity INT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // inventory_base_req
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_base_req (
        uuid UUID DEFAULT gen_random_uuid(),
        appId VARCHAR(255) NOT NULL,
        serviceType VARCHAR(255) NOT NULL,
        bizParam TEXT NOT NULL,
        timestamp BIGINT NOT NULL,
        sign TEXT NOT NULL,
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
      CREATE TABLE IF NOT EXISTS so_bizParam (
        base_req_uuid VARCHAR(255),
        shop VARCHAR(255) NOT NULL,
        onlineOrderNumber VARCHAR(255) NOT NULL,
        paymentMethod VARCHAR(255) NOT NULL,
        codPayAmount DECIMAL(5,4) NULL,
        freight DECIMAL(5,4) NULL,
        currency VARCHAR(255) NOT NULL,
        buyerMessage TEXT NULL,
        sellerRemarks TEXT NULL,
        payTime VARCHAR(255) NOT NULL,
        buyer JSONB NOT NULL,
        skuList JSON NOT NULL,
        orderCustomFieldValueVOList JSONB NULL,
        isSpecifyBatch BOOLEAN NULL,
        customerType VARCHAR(255) NULL,
        shippingLabel TEXT NULL,
        imgType TEXT NULL,
        documentFile TEXT NULL,
        documentType VARCHAR(255) NULL,
        documentName VARCHAR(255) NULL,
        trackingNumber VARCHAR(255) NULL,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    //sales order sku list
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_sku_list (
        onlineOrderNumber VARCHAR(255),
        sku VARCHAR(255) NOT NULL,
        payAmount DECIMAL(5,4) NOT NULL, 
        paymentPrice DECIMAL(5,4) NOT NULL,
        quantity INT NOT NULL,
        shippingPrice DECIMAL(5,4) NULL,
        promotionDiscount DECIMAL(5,4) NOT NULL,
        batchNo VARCHAR(255) NULL,
        mfgDate VARCHAR(255) NULL,
        expDate VARCHAR(255) NULL,
        originCountry VARCHAR(255),
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);


    //sales order buyer's list
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_buyer (
        onlineOrderNumber VARCHAR(255),
        buyerId VARCHAR(255) NULL,
        receiverName VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NULL,
        email VARCHAR(255) NULL,
        country VARCHAR(255) NOT NULL,
        province VARCHAR(255) NOT NULL,
        city VARCHAR(255) NULL,
        district VARCHAR(255) NULL,
        postCode VARCHAR(255) NOT NULL,
        address1 TEXT NOT NULL,
        address2 TEXT NULL,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);


    // so_biz_content_result
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_bizContent_result (
        base_req_uuid VARCHAR(255),
        orderNumber VARCHAR(255),
        sku VARCHAR(255),
        parentOrderNumber VARCHAR(255),
        isOriginalOrder BOOLEAN,
        onlineOrderNumber VARCHAR(255),
        shop VARCHAR(255),
        warehouse VARCHAR(255),
        status VARCHAR(255),
        wmsStatus VARCHAR(255),
        currency VARCHAR(255),
        totalAmount DECIMAL(5,4),
        freight DECIMAL(5,4),
        buyerMessage VARCHAR(255),
        sellerRemarks VARCHAR(255),
        carries VARCHAR(255),
        platform VARCHAR(255),
        updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        trackingNumber VARCHAR(255),
        paytime VARCHAR(255),
        shippingTime VARCHAR(255),
        createTime VARCHAR(255),
        buyer JSONB,
        estimateFulfillmentFee DECIMAL(5,2),
        totalDiscount DECIMAL(5,2),
        sellerDiscount DECIMAL(5,2),
        platformRebate DECIMAL(5,2),
        buyerPaidShippingFee DECIMAL(5,2),
        finalProductProtection DECIMAL(5,2),
        sellerDiscountForWook DECIMAL(5,2),
        platformRebateForWook DECIMAL(5,2),
        auditTime VARCHAR(255),
        latestShipDate VARCHAR(255),
        skuList JSONB,
        tag JSONB,
        platfromReturnToSeller DECIMAL(5,2),
        isBusinessOrder BOOLEAN,
        salesRecordNumber VARCHAR(255),
        siteCode VARCHAR(255),
        isAfn INT,
        platformShippingTime VARCHAR(255),
        paymentMethod VARCHAR(255),
        isDeleted INT,
        orderCustomFieldValueVOList JSONB,
        subOrderNumberList JSONB,
        onlineStatus VARCHAR(255),
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    //sales order result_sku
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_result_sku (
        onlineOrderNumber VARCHAR(255),
        orderSkuId INT,
        sku VARCHAR(255),
        sourceCombinedSku VARCHAR(255),
        quantity INT,
        onlineItemId VARCHAR(255),
        payAmount DECIMAL(5,4),
        totalTax DECIMAL(5,4),
        totalDiscount DECIMAL(5,4),
        platformDiscount DECIMAL(5,4),
        originalPrice DECIMAL(5,4),
        paymentPrice DECIMAL(5,4),
        shippingPrice DECIMAL(5,4),
        promotionDiscount DECIMAL(5,4), 
        discountPrice DECIMAL(5,4),
        subSkuList JSONB,
        tag JSONB,
        points TEXT,
        onlineProductCode VARCHAR(255),
        onlineProductTitle VARCHAR(255),
        onlineProductPicUrl TEXT,
        onlineTransactionId VARCHAR(255),
        snList JSONB,
        giftFlag INT,
        wmsSendAvailableQuantity INT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    //sales order result_skuTag 
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_result_skuTag (
        sku VARCHAR(255),
        isGift INT,
        preSale INT ,
        hasRefund INT,
        allReturned INT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    //sales order result_Tag 
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_result_tag (
        onlineOrderNumber VARCHAR(255),
        hasRefund INT,
        itemReturned INT,
        consolidated INT,
        split INT,
        locked INT,
        sendWms INT,
        sendFailed INT,
        onlineShipFeedbackAlready INT,
        onlineShipFeedbackFailed INT,
        outOfStock INT,
        preSale INT,
        onlineShipped INT,
        platformFulfillment INT,
        partRefund INT,
        allRefund INT,
        allReturned INT,
        partReturned INT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    //sales order result_SkuCustomFieldValueVO 
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_result_SkuCustomFieldValueVO (
        sku VARCHAR(255),
        tableName VARCHAR(255),
        columType  VARCHAR(255),
        columName VARCHAR(255),
        defaultValue VARCHAR(255),
        candidateValue VARCHAR(255),
        remark VARCHAR(255),
        required INT,
        isQuery INT,
        isShow INT,
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

createTables();

module.exports = client;
