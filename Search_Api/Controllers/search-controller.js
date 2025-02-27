const db = require("../Db/db");

const searchFunction = async (req, res) => {
  try {
    const { key } = req.params;

    //to enable partial matching
    const searchKey = `%${key}%`;
    // console.log(searchKey);

    const [stockRows] = await db.query(
      `SELECT * FROM dummy_stocks_list WHERE company LIKE ? OR sector LIKE ?`,
      [searchKey, searchKey]
    );

    const [fundRows] = await db.query(
      `
      SELECT * FROM mutualfunds_directplan_details WHERE Scheme_Name LIKE ?`,
      [searchKey]
    );

    const rows = [...stockRows, ...fundRows];

    if (rows.length === 0) {
      return res.status(401).json({
        error: true,
        message: "Data not found",
      });
    }

    //response
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something wrong unable to search",
    });
  }
};

//api for searchResult with other related sectors
const searchFunctionWithOtherSuggestion = async (req, res) => {
  try {
    const { key } = req.params;

    //get partial matching
    const searchKey = `%${key}%`;

    // Get the exact match for the searched company
    const [exactMatchRows] = await db.query(
      `SELECT * FROM dummy_stocks_list WHERE company LIKE ?`,
      [searchKey]
    );

    // Get other stocks related to the same sector
    let relatedStockRows = [];
    if (exactMatchRows.length > 0) {
      const sector = exactMatchRows[0].sector;
      relatedStockRows = await db.query(
        `SELECT * FROM dummy_stocks_list WHERE sector = ? AND company !=?`,
        [sector, searchKey, key]
      );
    }

    // Get mutual funds related to the same sector
    const [relatedFundsRows] = await db.query(
      `SELECT * FROM mutualfunds_directplan_details WHERE Scheme_Name LIKE ?`,
      [searchKey]
    );

    // Combine the results, with the exact match first
    // Convert buffer to string
    const rows = [...exactMatchRows, ...relatedStockRows, ...relatedFundsRows];

    if (rows.length === 0) {  
      return res.status(401).json({
        error: true,
        message: "Data not found",
      });
    }

    //Response
    return res.status(200).json({
      success: true,
      message: "Successfully able to search all data ",
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something wrong unable to search",
    });
  }
};

//route for sending all data for redux store
const getAllData = async (req, res) => {
  try {
    const [stockRows] = await db.query(`SELECT * FROM dummy_stocks_list`);
    const [fundRows] = await db.query(
      `SELECT * FROM mutualfunds_directplan_details`
    );

    const rows = [...stockRows, ...fundRows];

    if (rows.length === 0) {
      return res.status(401).json({
        error: true,
        message: "Data not found",
      });
    }

    //sending response
    return res.status(200).json({
      success: true,
      message: "Successfully get all data",
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something wrong unable to send all data",
    });
  }
};

module.exports = {
  searchFunction,
  getAllData,
  searchFunctionWithOtherSuggestion,
};
