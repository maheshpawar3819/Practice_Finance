require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2");
const yahooFinance = require("yahoo-finance2").default;

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
const db = mysql
  .createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
  })
  .promise();

db.connect((err) => {
  if (err) {
    console.error(`my Sql connection error`, err);
    process.exit(1);
  }

  console.log(`connected to server`);
});

//function to fetch api and save the data into mysql table
const fetchAndSaveNifty50 = async () => {
  try {
    // Stocks Symball for fetching
    const niftyStocks = [
      "RELIANCE.NS",
      "TCS.NS",
      "INFY.NS",
      "HDFC.NS",
      "ICICIBANK.NS",
    ];

    //loop for save symball into the table
    for (let symbol of niftyStocks) {

      const response = await yahooFinance.quote(symbol);

      console.log(response);

      if (
        !response ||
        !response.regularMarketPrice ||
        !response.regularMarketOpen ||
        !response.regularMarketDayHigh ||
        !response.regularMarketDayLow ||
        !response.regularMarketChangePercent
      ) {
        console.error(`Missing data for symbol: ${symbol}`);
        continue;
      }

      const {
        regularMarketPrice,
        regularMarketOpen,
        regularMarketDayHigh,
        regularMarketDayLow,
        regularMarketChangePercent,
      } = response;



      //   save and update the data in to the table
      const query = `INSERT INTO nifty50_stocks (symbol, open_price, high_price, low_price, last_price, change_percent)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      open_price = VALUES(open_price),
      high_price = VALUES(high_price),
      low_price = VALUES(low_price),
      last_price = VALUES(last_price),
      change_percent = VALUES(change_percent)
      `;

      db.query(
        query,
        [
          symbol,
          regularMarketOpen,
          regularMarketDayHigh,
          regularMarketDayLow,
          regularMarketPrice,
          regularMarketChangePercent,
        ],

        (err) => {
          if (err) {
            console.log(`Error to saving ${symbol}`, err);
          }
        }
      );
    }
    console.log("Nifty 50 data fetched and stored successfully");
  } catch (error) {
    console.error("Error fetching Nifty 50 data:", error.message);
  }
};

//fetching the data every minute
setInterval(fetchAndSaveNifty50, 60000);

//socket io for client
//emit connection for client via socket.io
io.on("conncetion", (socket) => {
  console.log("new client is connected", socket.id);

  // send updates to the client
  setInterval(() => {
    db.query(`SELECT * FROM nifty50_stocks`, (err, results) => {
      if (err) {
        console.log(`error to fetching stocks`, err);
        return;
      }

      //send response to client
      io.emit("stock Update", results);
    });
  }, 8000);

  socket.on("disconnect", () => {
    console.log(`client is disconnect`, socket.id);
  });
});

//server connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is listning on port : `, PORT);
});
