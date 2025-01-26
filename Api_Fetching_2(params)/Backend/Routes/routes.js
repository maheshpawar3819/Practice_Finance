const db = require("../DB/db");
const express = require("express");
const router = express.Router();

//get route for fetching all companies
router.route("/").get((req, res) => {
  try {
    db.query(`SELECT * FROM comapanies_stocks_list`, (err, result) => {
      if (err) {
        console.log(`Not able to fetch companies`, err);
      }
      // console.log(result);

      res.status(200).json({
        success: true,
        message: "Successfully to fetch all stock companies",
        result,
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server side error",
    });
  }
});

module.exports = router;
