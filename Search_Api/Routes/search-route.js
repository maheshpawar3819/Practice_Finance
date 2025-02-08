const express = require("express");
const {
  searchFunction,
  getAllData,
} = require("../Controllers/search-controller");
const router = express.Router();

//routes
router.route("/search/:key").get(searchFunction);

//route for get all data from company tand and mutual fund table
router.route("/allInfo").get(getAllData);

module.exports = router;
