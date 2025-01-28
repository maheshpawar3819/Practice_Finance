require("dotenv").config();
const mysql = require("mysql2");

const db = mysql
  .createPool({
    port:process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    waitForConnections: true,
    connectTimeout: 10000,
  })
  .promise();

module.exports = db;
