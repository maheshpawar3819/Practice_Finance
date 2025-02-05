require("dotenv").config();
const mysql = require("mysql2");

const db = mysql
  .createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
  })
  .promise();

module.exports = db;
