require("dotenv").config();
const mysql = require("mysql2");

const db = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  })
  .promise();

module.exports = db;
