const { fetchIndexData } = require("../services/yaahoFinanceService");
const db = require("../db_conig/db");

// index symobls of sotck market
const indices = {
  NIFTY50: "^NSEI",
  BANKNIFTY: "^NSEBANK",
};

const fetchAndStoreData = async () => {
  // Iterate over each index in the indices object
  for (const [name, symbol] of Object.entries(indices)) {
    // Fetch the index data using the fetchIndexData function
    const data = await fetchIndexData(symbol);
    //check
    if (data) {
      console.log(`fetch data for ${name}`, data);
    }

    //query for store data into table
    await db.query(
      `INSERT INTO index_data (index_name,date,open_price,high_price,low_price,current_price)
             VALUES (?,?,?,?,?,?)`,
      [name, data.date, data.open, data.high, data.low, data.current]
    );
  }
};

module.exports = { fetchAndStoreData, indices };
