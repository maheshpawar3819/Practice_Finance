require("dotenv").config();
const express = require("express");
const app = express();
// const cors = require("cors");
const axios = require("axios");
const mysql = require("mysql2/promise");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const fetchDataAndStore = async () => {
  try {
    console.log("Fetching Data ....");
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=IBM&apikey=${process.env.API_KEY}`
    );

    // console.log("Full Response Data:", response.data);
    if (response.status !== 200) {
      throw new Error(`API request failed with status code ${response.status}`);
    }

    const data = response.data["Weekly Time Series"];
    if (!data) {
      return console.log("No data found in the response");
    }

    // console.log("Parsed Data:", data);

    let stockData = [];
    for (let date in data) {
      // console.log(`Processing date: ${date}`); // Debugging: log date
      stockData.push({
        date: date,
        open: parseFloat(data[date]["1. open"]),
        high: parseFloat(data[date]["2. high"]),
        low: parseFloat(data[date]["3. low"]),
        close: parseFloat(data[date]["4. close"]),
        volume: parseInt(data[date]["5. volume"]),
      });
    }

    // console.log("Stock Data Array:", stockData);

    console.log("Connecting to the database...");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
    });

    // Create the table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE,
        open FLOAT,
        high FLOAT,
        low FLOAT,
        close FLOAT,
        volume INT
      );
    `);

    await connection.beginTransaction();
    for (let stock of stockData) {
      // console.log(`Inserting data for date: ${stock.date}`); // Debugging: log insertion
      await connection.query(
        `INSERT INTO stocks (date, open, high, low, close, volume) VALUES (?,?,?,?,?,?)`,
        [
          stock.date,
          stock.open,
          stock.high,
          stock.low,
          stock.close,
          stock.volume,
        ]
      );
    }

    await connection.commit();
    console.log("Data successfully stored in the database");
  } catch (error) {
    console.error("Error during fetchDataAndStore:", error);
  }
};

const fetchDataAndStoreMonth = async () => {
  try {
    console.log("Fetching Data ....");
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=${process.env.API_KEY}`
    );

    // console.log("Full Response Data:", response.data);
    if (response.status !== 200) {
      throw new Error(`API request failed with status code ${response.status}`);
    }

    const data = response.data["Weekly Time Series"];
    if (!data) {
      return console.log("No data found in the response");
    }

    // console.log("Parsed Data:", data);

    let stockData = [];
    for (let date in data) {
      // console.log(`Processing date: ${date}`); // Debugging: log date
      stockData.push({
        date: date,
        open: parseFloat(data[date]["1. open"]),
        high: parseFloat(data[date]["2. high"]),
        low: parseFloat(data[date]["3. low"]),
        close: parseFloat(data[date]["4. close"]),
        volume: parseInt(data[date]["5. volume"]),
      });
    }

    // console.log("Stock Data Array:", stockData);

    console.log("Connecting to the database...");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
    });

    // Create the table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stocksMonth (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE,
        open FLOAT,
        high FLOAT,
        low FLOAT,
        close FLOAT,
        volume INT
      );
    `);

    await connection.beginTransaction();
    for (let stockmonth of stockData) {
      // console.log(`Inserting data for date: ${stock.date}`); // Debugging: log insertion
      await connection.query(
        `INSERT INTO stocks (date, open, high, low, close, volume) VALUES (?,?,?,?,?,?)`,
        [
          stockmonth.date,
          stockmonth.open,
          stockmonth.high,
          stockmonth.low,
          stockmonth.close,
          stockmonth.volume,
        ]
      );
    }

    await connection.commit();
    console.log("Data successfully stored in the database 2");
  } catch (error) {
    console.error("Error during fetchDataAndStore:", error);
  }
};

// Fetch function call
fetchDataAndStore();
fetchDataAndStoreMonth();

let Port = process.env.PORT || 5041;
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
