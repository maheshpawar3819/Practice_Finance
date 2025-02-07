const express = require("express");
const { searchFunction } = require("../Controllers/search-controller");
const router = express.Router();

//routes
router.route("/search/:key").get(searchFunction);

module.exports=router;
