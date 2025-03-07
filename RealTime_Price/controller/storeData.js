const pool = require("../db_conig/db"); // Ensure correct path
const stockData = require("./Active_NSE_StockList.json");

const toNumber = (value) => (value === "—" || value === undefined ? null : parseFloat(value));
const toBigInt = (value) => {
  if (!value || value === "—") return null;
  return BigInt(value.replace(/,/g, "")); // Convert "Market cap (₹)" to BigInt
};

const insertStockData = async () => {
  try {
    const connection = await pool.getConnection();

    const query = `
        INSERT INTO NSE_Active_Stocks 
        (symbol, name, market_cap_bigint, market_cap_str, price, change_percentage, volume, rel_volume, pe, eps_ttm, eps_growth, div_yield, analyst_rating) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const stock of stockData) {
      if (!stock.Symbol || stock.Symbol.trim() === "") continue; // Skip missing symbols

      const values = [
        stock.Symbol.trim(),
        stock.Name,
        toBigInt(stock["Market cap (₹)"]),
        stock["Market cap"],
        parseFloat(stock.Price) || null,
        stock["Change %"],
        stock["Volume"] || stock["Valume"], // Handle typo
        parseFloat(stock["Rel Volume"]) || null,
        toNumber(stock["P/E"]),
        toNumber(stock["EPS dil\nTTM"]),
        stock["EPS dil growth\nTTM YoY"],
        stock["Div yield %\nTTM"],
        stock["Analyst Rating"] || "Neutral",
      ];

      await connection.query(query, values);
    }

    console.log("Data inserted successfully!");
    connection.release();
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

insertStockData();
