const db = require("../db");

const addStockHome = async (req, res) => {
  try {
    const {
      company,
      ltp,
      change_percent,
      market_cap,
      fifty_two_week_high,
      fifty_two_week_low,
      sector,
      current_pe,
      clarification,
    } = req.body;

    // Log incoming data for debugging
    console.log(
      company,
      ltp,
      change_percent,
      market_cap,
      fifty_two_week_high,
      fifty_two_week_low,
      sector,
      current_pe,
      clarification
    );

    // SQL query to insert data into the database
    const query = `
          INSERT INTO home_page_table (
            company, ltp, change_percent, market_cap, 
            fifty_two_week_high, fifty_two_week_low, sector, 
            current_pe, clarification
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    // Use await with db.query for promise-based execution
    const [result] = await db.query(query, [
      company,
      ltp,
      change_percent,
      market_cap,
      fifty_two_week_high,
      fifty_two_week_low,
      sector,
      current_pe,
      clarification,
    ]);

    // Check if the insertion was successful
    if (!result || result.affectedRows === 0) {
      return res.status(400).json({
        error: true,
        message: "Failed to add stock data",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Successfully added all data",
    });
  } catch (error) {
    console.error("Error while adding stock data:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};


const addAnaylistData = async (req, res) => {
  try {
    // Destructure the request body for financial data
    const {
      company,
      ltp,
      change_percent,
      market_cap,
      clarification,
      roe,
      pe,
      pbv,
      ev_ebitda,
      five_year_sales_growth,
      five_year_profit_growth,
    } = req.body;

    // SQL query to insert data into the stock_anaylist table
    const query = `
      INSERT INTO stock_anaylist (
        company, ltp, change_percent, market_cap, 
        clarification, roe, pe, pbv, 
        ev_ebitda, five_year_sales_growth, five_year_profit_growth
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the query with the provided data
    const [result] = await db.query(query, [
      company,
      ltp,
      change_percent,
      market_cap,
      clarification,
      roe,
      pe,
      pbv,
      ev_ebitda,
      five_year_sales_growth,
      five_year_profit_growth,
    ]);

    // Check if the data was successfully inserted
    if (!result || result.affectedRows === 0) {
      return res.status(400).json({
        error: true,
        message: "Failed to add financial data",
      });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Financial data added successfully",
    });
  } catch (error) {
    // Log and send an error response
    console.error("Error while adding financial data:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};


module.exports = {addStockHome , addAnaylistData};
