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
    await client.connect();

    await client.query(`
        CREATE TABLE IF NOT EXISTS client_tokens (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        jti UUID NOT NULL UNIQUE,
        token TEXT,
        issued_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NULL,
        revoked BOOLEAN NOT NULL DEFAULT FALSE,
        revoked_at TIMESTAMP
        );
    `);
    await client.query(` CREATE INDEX idx_client_name ON client_tokens (client_name); `);
    await client.query(` CREATE INDEX idx_jti ON client_tokens (jti); `);
};


createTables();

module.exports = client;