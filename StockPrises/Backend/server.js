require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql");
const { error } = require("console");

//express app
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

//setup io connection
const io = new Server(
  server,
  //cors for io socket
  {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  }
);

//Detabse connetion
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
});

db.connect((err) => {
  if (err) {
    console.error(`my Sql connection error`, error);
    process.exit(1);
  }

  console.log(`connected to server`);
});

//function to fetch api and save the data into mysql table
const fetchAndSaveNifty50 = async () => {
  try {
    // Stocks Symball for fetching
    const niftyStocks = ["RELIANCE", "TCS", "INFY", "HDFC", "ICICIBANK"];

    //loop for save symball into the table
    for (let symbol of niftyStocks) {
      const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      console.log(response.data);
      const stockData = response.data;
      //   extract values from data
      const { lastPrice, open, dayHigh, dayLow, pChange } = stockData;

      //   save and update the data in to the table
      const query = `INSERT INTO nifty50_stocks (symbol,open_price,high_price,low_price,last_price,change_percent)
      VALUES (?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
      open_price : VALUES(open_price),
      high_price : VALUES(high_price),
      low_price : VALUES(low_price),
      last_price : VALUES(last_price),
      change_percent : VALUES(change_percent),
      updated_at : CURRENT_TIMESTAMP
      `;

      db.query(
        query,
        [symbol, open, dayHigh, dayLow, lastPrice, pChange],
        (err) => {
          if (err) {
            console.log(`Error to saving ${symbol}`, err);
          }
        }
      );
    }
    console.log("Nifty 50 data fetched and stored successfully");
  } catch (error) {
    console.error("Error fetching Nifty 50 data:", error);
  }
};


