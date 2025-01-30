require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use("/api");

const API_KEY = process.env.API_KEY;
const SYMBOL = "RELIANCE.BSE";

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

const fetchStockData = async () => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${SYMBOL}&apikey=${API_KEY}`
    );
    console.log(SYMBOL);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

fetchStockData();

const Port = process.env.PORT || 5000;
app.listen(Port, () => {
  console.log(`Server is listning on port : ${Port}`);
});
