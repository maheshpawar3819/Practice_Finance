require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const mysql = require("mysql2");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use("/api");

//db connection

const db = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
  })
  .promise();

// code for alpha vantage website
// api key for alphavantage
// const API_KEY = process.env.API_KEY;
// const SYMBOL = "RELIANCE.BSE";

// const fetchStockData = async () => {
//   try {
//     // Fetch Company Overview
//     const overviewResponse = await axios.get(
//       `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${SYMBOL}&apikey=${API_KEY}`
//     );
//     console.log("📌 API Response (Company Overview):", overviewResponse.data);

//     // Fetch Quarterly Earnings
//     const earningsResponse = await axios.get(
//       `https://www.alphavantage.co/query?function=EARNINGS&symbol=${SYMBOL}&apikey=${API_KEY}`
//     );
//     console.log("📌 API Response (Quarterly Earnings):", earningsResponse.data);

//     // Fetch Balance Sheet
//     const balanceSheetResponse = await axios.get(
//       `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${SYMBOL}&apikey=${API_KEY}`
//     );
//     console.log("📌 API Response (Balance Sheet):", balanceSheetResponse.data);

//     // Debug if response contains data
//     if (!overviewResponse.data || overviewResponse.data.Note) {
//       throw new Error("API Limit reached or no data available for this stock.");
//     }

//     console.log("\n📌 Company Overview:");
//     console.log({
//       Symbol: overviewResponse.data.Symbol,
//       MarketCapitalization: overviewResponse.data.MarketCapitalization,
//       DebtToEquityRatio: overviewResponse.data.DebtToEquity,
//       EBITDA: overviewResponse.data.EBITDA,
//       RevenuePerShare: overviewResponse.data.RevenuePerShareTTM,
//     });

//     console.log("\n📌 Quarterly Earnings:");
//     if (earningsResponse.data && earningsResponse.data.quarterlyEarnings) {
//       console.log(earningsResponse.data.quarterlyEarnings.slice(0, 2));
//     } else {
//       console.log("No earnings data available.");
//     }

//     console.log("\n📌 Balance Sheet:");
//     if (
//       balanceSheetResponse.data &&
//       balanceSheetResponse.data.quarterlyReports
//     ) {
//       console.log(balanceSheetResponse.data.quarterlyReports.slice(0, 2));
//     } else {
//       console.log("No balance sheet data available.");
//     }
//   } catch (error) {
//     console.error("❌ Error fetching stock data:", error.message);
//   }
// };

// fetchStockData();
// const getStockData = async () => {
//   const apiKey = process.env.API_KEY;
//   const symbol = "RELIANCE.BSE";
//   const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

//   try {
//     const response = await axios.get(url);
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// };

// getStockData();

// for historical data

// const fetchStockData = async () => {
//   try {
//     const response = await axios.get(
//       `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${SYMBOL}&apikey=${API_KEY}`
//     );
//     console.log(SYMBOL);
//     console.log(response.data);
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//   }
// };

// fetchStockData();
// ------------------------------------------------------------------------------------------------
//code for rapid api
const options = {
  method: "GET",
  url: "https://indian-stock-exchange-api1.p.rapidapi.com/stock_price/",
  params: {
    symbol: "BHARTIARTL",
  },
  headers: {
    "x-rapidapi-host": "indian-stock-exchange-api1.p.rapidapi.com",
    "x-rapidapi-key": "3f6100f9a8msh84da985d4e6ba75p1fae37jsn33986da89717",
  },
};

axios
  .request(options)
  .then(async (response) => {
    console.log(response?.data);
    const stocksData = response?.data;

    const query = `INSERT INTO stocks_data (
      symbol, open, day_high, day_low, previous_close, last_trading_price,
      lowPriceRange, highPriceRange, volume, day_change, day_change_percent,
      totalBuyQty, totalSellQty
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      stocksData?.symbol || null,
      stocksData?.open || 0,
      stocksData?.day_high || 0,
      stocksData?.day_low || 0,
      stocksData?.previous_close || 0,
      stocksData?.last_trading_price || 0,
      stocksData?.lowPriceRange || 0,
      stocksData?.highPriceRange || 0,
      stocksData?.volume || 0,
      stocksData?.day_change || 0,
      stocksData?.day_change_percent || 0,
      stocksData?.totalBuyQty || 0,
      stocksData?.totalSellQty || 0,
    ];
    try {
      const [result] = await db.execute(query, values);
      console.log("Data inserted successfully:", result);
    } catch (error) {
      console.error("❌ Error inserting data:", error.message);
    }
  })
  .catch((error) => {
    console.log(error);
  });

const Port = process.env.PORT || 5000;
app.listen(Port, () => {
  console.log(`Server is listning on port : ${Port}`);
});
