const db = require("../DB/db");
const express = require("express");
const router = express.Router();

//get route for fetching all companies with imbeded pagination
router.route("/companies").get(async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const offset = (page - 1) * pageSize;

    //fetch companies with pagination
    const [result] = await db.query(
      "SELECT * FROM comapanies_stocks_list LIMIT ? OFFSET ?",
      [parseInt(pageSize), offset]
    );

    //getting total number of companies for pagination data
    const [[totalResult]] = await db.query(
      `SELECT COUNT(*) AS totalRecords FROM comapanies_stocks_list`
    );

    const totalRecords = totalResult.totalRecords;
    const totalPages = Math.ceil(totalRecords / pageSize);

    //checking requested page is valid
    if (page > totalPages || page < 1) {
      return res.status(400).json({
        error: true,
        message: `Invalid page number. Please provide a page number between 1 and ${totalPages}.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully fetched stock companies",
      result,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server side error",
    });
  }
});

//getting specific sector
router.route("/companies/sector/:sector").get(async (req, res) => {
  try {
    const { sector } = req.params;
    // console.log(sector);

    if (!sector) {
      return res.status(400).json({
        error: true,
        message: "Sector parameter is required",
      });
    }

    const [result] = await db.query(
      `SELECT * FROM comapanies_stocks_list WHERE sector = ?`,
      [sector]
    );

    return res.status(200).json({
      success: true,
      message: `Successfully fetched all ${sector}`,
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server side error",
    });
  }
});

router
  .route("/companies/market-cap/:comparison/:value")
  .get(async (req, res) => {
    try {
      const { comparison, value } = req.params;

      // console.log(comparison, value);
      if ((!comparison, !value)) {
        return res.status(400).json({
          error: true,
          message: "parameter is required",
        });
      }

      let query;
      switch (comparison) {
        case "gt":
          query = `SELECT * FROM comapanies_stocks_list WHERE Market_cap_in_Lakh > ?`;
          break;
        case "lt":
          query = `SELECT * FROM comapanies_stocks_list WHERE Market_cap_in_Lakh < ?`;
          break;
        case "eq":
          query = `SELECT * FROM comapanies_stocks_list WHERE Market_cap_in_Lakh = ? `;
          break;
        default:
          return res.status(400).json({
            error: true,
            message:
              "Invalid comparison parameter. Use 'gt' for greater than, 'lt' for less than, or 'eq' for equal to.",
          });
      }

      const [result] = await db.query(query, [value]);

      return res.status(200).json({
        success: true,
        message: `Successfully fetched companies with market cap ${comparison} ${value}`,
        result,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Server side error",
      });
    }
  });

//route for filter price
router.route("/companies/price/:comparison/:value").get(async (req, res) => {
  try {
    const { comparison, value } = req.params;

    //error handling
    if ((!comparison, !value)) {
      return res.status(400).json({
        error: true,
        message: "parameters are required",
      });
    }

    let query;
    switch (comparison) {
      case "gt":
        query = `SELECT * FROM comapanies_stocks_list WHERE Price > ?`;
        break;
      case "lt":
        query = `SELECT * FROM comapanies_stocks_list WHERE Price < ?`;
        break;
      case "eq":
        query = `SELECT * FROM comapanies_stocks_list WHERE Price = ?`;
        break;
      default:
        return res.status(400).json({
          error: true,
          message:
            "Invalid comparison parameter. Use 'gt' for greater than, 'lt' for less than, or 'eq' for equal to.",
        });
    }

    const [result] = await db.query(query, [value]);

    return res.status(200).json({
      success: true,
      message: `Successfully fetched companies with market cap ${comparison} ${value}`,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server side error",
    });
  }
});

module.exports = router;
