const db = require("../DB/db");
const express = require("express");
const router = express.Router();

//get route for fetching all companies
router.route("/companies").get(async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM companies");

    res.status(200).json({
      success: true,
      message: "Successfully fetched all stock companies",
      result,
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
      `SELECT * FROM companies WHERE sector = ?`,
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
          message: "Sector parameter is required",
        });
      }

      let query;
      switch (comparison) {
        case "gt":
          query = `SELECT * FROM companies WHERE market_cap > ?`;
          break;
        case "lt":
          query = `SELECT * FROM companies WHERE market_cap < ?`;
          break;
        case "eq":
          query = `SELECT * FROM companies WHERE market_cap = ? `;
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
        result
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Server side error",
      });
    }
  });

module.exports = router;
