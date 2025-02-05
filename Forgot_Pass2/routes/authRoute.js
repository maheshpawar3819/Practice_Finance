require("dotenv").config();
const express = require("express");
const {
  adduser,
  forgetPassword,
  resetPassword,
} = require("../controller/auth-controller");
const router = express.Router();

router.route("/add-user").post(adduser);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:token").post(resetPassword);

module.exports = router;
