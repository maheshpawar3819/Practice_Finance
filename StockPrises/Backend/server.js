require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2");
const yahooFinance = require("yahoo-finance2").default;

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const db = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

const fetchAndSaveNifty50 = async () => {
  try {
    const niftyStocks = [
      "RELIANCE.NS",
      "TCS.NS",
      "INFY.NS",
      "ICICIBANK.NS",
      "HDFCBANK.NS",
      "BHARTIARTL.NS",
      "KOTAKBANK.NS",
      "ITC.NS",
      "LT.NS",
      "SBIN.NS",
      "AXISBANK.NS",
      "HCLTECH.NS",
      "WIPRO.NS",
      "ASIANPAINT.NS",
      "SUNPHARMA.NS",
      "TITAN.NS",
      "ULTRACEMCO.NS",
      "BAJFINANCE.NS",
      "BAJAJFINSV.NS",
      "POWERGRID.NS",
      "GRASIM.NS",
      "TATASTEEL.NS",
      "ONGC.NS",
      "NTPC.NS",
      "JSWSTEEL.NS",
      "COALINDIA.NS",
      "HINDALCO.NS",
      "BPCL.NS",
      "HEROMOTOCO.NS",
      "M&M.NS",
      "MARUTI.NS",
      "EICHERMOT.NS",
      "INDUSINDBK.NS",
      "ADANIPORTS.NS",
      "TECHM.NS",
      "CIPLA.NS",
      "DIVISLAB.NS",
      "BRITANNIA.NS",
      "DRREDDY.NS",
      "NESTLEIND.NS",
      "HINDUNILVR.NS",
      "SBILIFE.NS",
      "ICICIGI.NS",
      "BAJAJ-AUTO.NS",
      "APOLLOHOSP.NS",
      "TATAMOTORS.NS",
      "UPL.NS",
      "DABUR.NS",
      "PIDILITIND.NS",
    ];

    for (let symbol of niftyStocks) {
      const response = await yahooFinance.quoteSummary(symbol, {
        modules: ["price", "summaryDetail", "defaultKeyStatistics"],
      });

      if (!response || !response.price || !response.summaryDetail) {
        console.error(`Missing data for symbol: ${symbol}`);
        continue;
      }

      const {
        regularMarketPrice,
        regularMarketOpen,
        regularMarketDayHigh,
        regularMarketDayLow,
      } = response.price || {};

      const { marketCap, fiftyTwoWeekHigh, fiftyTwoWeekLow, trailingPE } =
        response.summaryDetail || {};

      const query = `INSERT INTO nifty50_stocks (
        symbol, open_price, high_price, low_price, last_price, change_percent, 
        market_cap, volume, fifty_two_week_high, fifty_two_week_low, pe_ratio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        open_price = VALUES(open_price),
        high_price = VALUES(high_price),
        low_price = VALUES(low_price),
        last_price = VALUES(last_price),
        change_percent = VALUES(change_percent),
        market_cap = VALUES(market_cap),
        volume = VALUES(volume),
        fifty_two_week_high = VALUES(fifty_two_week_high),
        fifty_two_week_low = VALUES(fifty_two_week_low),
        pe_ratio = VALUES(pe_ratio)`;

      await db.query(query, [
        symbol,
        regularMarketOpen || 0,
        regularMarketDayHigh || 0,
        regularMarketDayLow || 0,
        regularMarketPrice || 0,
        null,
        marketCap || 0,
        null,
        fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow || 0,
        trailingPE || 0,
      ]);

      console.log(`Saved data for ${symbol}`);
    }
  } catch (error) {
    console.error("Error fetching Nifty 50 data:", error.message);
  }
};

setInterval(fetchAndSaveNifty50, 60000);

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

setInterval(() => {
  db.query("SELECT * FROM nifty50_stocks")
    .then(([results]) => {
      io.emit("stockUpdate", results);
    })
    .catch((err) => {
      console.log("Error fetching stocks:", err);
    });
}, 8000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
