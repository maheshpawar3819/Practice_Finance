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
    console.log(sector);

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

module.exports = router;
