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
        rawData JSONB NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        rawResponse JSONB NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // upstream_input_formatted
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_upstream_input_formatted (
        uuid UUID DEFAULT gen_random_uuid(),
        rawUuid VARCHAR(255) NULL,
        appId VARCHAR(255) NULL,
        shop VARCHAR(255) NULL,
        serviceType VARCHAR(255) NULL,
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
        receiverAddress TEXT NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        state VARCHAR(50) NULL,
        responseCode VARCHAR(10) NULL,
        response_date TIMESTAMP NULL,
        trackingNumber TEXT NULL,
        carrier TEXT NULL
      );
    `);

    //upstream_input_formatted_sku
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_upstream_input_formatted_sku (
        upstream_formatted_uuid VARCHAR(255) NULL,
        onlineOrderNumber VARCHAR(255) NULL,
        appId VARCHAR(255) NULL,
        sku VARCHAR(255) NULL,
        payAmount DECIMAL(10,2) NULL,
        paymentPrice DECIMAL(10,2) NULL,
        quantity INT NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // inventory_base_req
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_base_req (
        uuid UUID DEFAULT gen_random_uuid(),
        uuid_bizParam VARCHAR(255) NULL,
        appId VARCHAR(255) NOT NULL,
        serviceType VARCHAR(255) NOT NULL,
        bizParam TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        sign TEXT NOT NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        errorCode VARCHAR(50) NULL,
        errorMsg TEXT NULL,
        state VARCHAR(50) NULL,
        bizContent TEXT NULL,
        response_date TIMESTAMP NULL
      );
    `);

    // inventory_biz_param
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_bizParam (
        uuid UUID DEFAULT gen_random_uuid(),
        shop VARCHAR(255) NOT NULL,
        onlineOrderNumber VARCHAR(255) NOT NULL,
        paymentMethod VARCHAR(255) NOT NULL,
        codPayAmount DECIMAL(10,2) NULL,
        freight DECIMAL(10,2) NULL,
        currency VARCHAR(255) NOT NULL,
        buyerMessage TEXT NULL,
        sellerRemarks TEXT NULL,
        payTime VARCHAR(255) NOT NULL,
        buyer JSONB NOT NULL,
        skuList JSONB NOT NULL,
        orderCustomFieldValueVOList JSONB NULL,
        isSpecifyBatch BOOLEAN NULL,
        customerType VARCHAR(255) NULL,
        shippingLabel TEXT NULL,
        imgType TEXT NULL,
        documentFile TEXT NULL,
        documentType VARCHAR(255) NULL,
        documentName VARCHAR(255) NULL,
        trackingNumber VARCHAR(255) NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    //sales order sku list
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_sku_list (
        onlineOrderNumber VARCHAR(255) NULL,
        sku VARCHAR(255) NOT NULL,
        payAmount DECIMAL(10,2) NOT NULL, 
        paymentPrice DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        shippingPrice DECIMAL(10,2) NULL,
        promotionDiscount DECIMAL(10,2) NULL,
        batchNo VARCHAR(255) NULL,
        mfgDate VARCHAR(255) NULL,
        expDate VARCHAR(255) NULL,
        originCountry VARCHAR(255) NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
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
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);


    // so_biz_content_result
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_bizContent_result (
        base_req_uuid VARCHAR(255) NULL,
        orderNumber VARCHAR(255) NULL,
        parentOrderNumber VARCHAR(255) NULL,
        isOriginalOrder BOOLEAN NULL,
        onlineOrderNumber VARCHAR(255) NULL,
        shop VARCHAR(255) NULL,
        warehouse VARCHAR(255) NULL,
        status VARCHAR(255) NULL,
        wmsStatus VARCHAR(255) NULL, 
        currency VARCHAR(255) NULL,
        totalAmount DECIMAL(10,2) NULL,
        freight DECIMAL(10,2) NULL,
        buyerMessage VARCHAR(255) NULL,
        sellerRemarks VARCHAR(255) NULL,
        carries VARCHAR(255) NULL,
        platform VARCHAR(255) NULL,
        updateTime TIMESTAMP NULL,
        trackingNumber VARCHAR(255) NULL,
        paytime VARCHAR(255) NULL,
        shippingTime VARCHAR(255) NULL,
        createTime VARCHAR(255) NULL,
        buyer JSONB NULL,
        estimateFulfillmentFee DECIMAL(5,2) NULL,
        totalDiscount DECIMAL(5,2) NULL,
        sellerDiscount DECIMAL(5,2) NULL,
        platformRebate DECIMAL(5,2) NULL,
        buyerPaidShippingFee DECIMAL(5,2) NULL,
        finalProductProtection DECIMAL(5,2) NULL,
        sellerDiscountForWook DECIMAL(5,2) NULL,
        platformRebateForWook DECIMAL(5,2) NULL,
        auditTime VARCHAR(255) NULL,
        latestShipDate VARCHAR(255) NULL,
        skuList JSONB NULL,
        tag JSONB NULL,
        platfromReturnToSeller DECIMAL(5,2) NULL,
        isBusinessOrder BOOLEAN NULL,
        salesRecordNumber VARCHAR(255) NULL,
        siteCode VARCHAR(255) NULL,
        isAfn INT NULL,
        platformShippingTime VARCHAR(255) NULL,
        paymentMethod VARCHAR(255) NULL,
        isDeleted INT NULL,
        orderCustomFieldValueVOList JSONB NULL,
        subOrderNumberList JSONB NULL,
        onlineStatus VARCHAR(255) NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        codpayamount DECIMAL(10,2) NULL,
        errorcode TEXT NULL,
        errormsg TEXT NULL,
        state VARCHAR(50) NULL
      );
    `);

    //sales order result_sku
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_result_sku (
        onlineOrderNumber VARCHAR(255) NULL,
        orderSkuId INT NULL,
        sku VARCHAR(255) NULL,
        sourceCombinedSku VARCHAR(255) NULL,
        quantity INT NULL,
        onlineItemId VARCHAR(255) NULL,
        payAmount DECIMAL(10,2) NULL,
        totalTax DECIMAL(10,2) NULL,
        totalDiscount DECIMAL(10,2) NULL,
        platformDiscount DECIMAL(10,2) NULL,
        originalPrice DECIMAL(10,2) NULL,
        paymentPrice DECIMAL(10,2) NULL,
        shippingPrice DECIMAL(10,2) NULL,
        promotionDiscount DECIMAL(10,2) NULL, 
        discountPrice DECIMAL(10,2) NULL,
        subSkuList JSONB NULL,
        tag JSONB NULL,
        points TEXT NULL,
        onlineProductCode VARCHAR(255) NULL,
        onlineProductTitle VARCHAR(255) NULL,
        onlineProductPicUrl TEXT NULL,
        onlineTransactionId VARCHAR(255) NULL,
        snList JSONB NULL,
        giftFlag INT NULL,
        wmsSendAvailableQuantity INT NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    //sales order result_skuTag 
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_result_skuTag (
        onlineordernumber VARCHAR(255) NULL,
        isGift INT NULL,
        preSale INT NULL,
        hasRefund INT NULL,
        allReturned INT NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    //sales order result_Tag 
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_result_tag (
        onlineOrderNumber VARCHAR(255) NULL,
        hasRefund INT NULL,
        itemReturned INT NULL,
        consolidated INT NULL,
        split INT NULL,
        locked INT NULL,
        sendWms INT NULL,
        sendFailed INT NULL,
        onlineShipFeedbackAlready INT NULL,
        onlineShipFeedbackFailed INT NULL,
        outOfStock INT NULL,
        preSale INT NULL,
        onlineShipped INT NULL,
        platformFulfillment INT NULL,
        partRefund INT NULL,
        allRefund INT NULL,
        allReturned INT NULL,
        partReturned INT NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    //sales order result_SkuCustomFieldValueVO 
    await client.query(`
      CREATE TABLE IF NOT EXISTS so_result_SkuCustomFieldValueVO (
        sku VARCHAR(255) NULL,
        tableName VARCHAR(255) NULL,
        columType  VARCHAR(255) NULL,
        columName VARCHAR(255) NULL,
        defaultValue VARCHAR(255) NULL,
        candidateValue VARCHAR(255) NULL,
        remark VARCHAR(255) NULL,
        required INT NULL,
        isQuery INT NULL,
        isShow INT NULL,
        created_date  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
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
