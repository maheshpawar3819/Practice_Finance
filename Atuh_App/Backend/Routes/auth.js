const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../Db/db");

// success routes
// Google login success route
router.get("/login/google/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged In via Google",
      user: req.user,
    });
  } else {
    res.status(401).json({
      error: true,
      message: "Not Authorized",
    });
  }
});

// LinkedIn login success route
router.get("/login/linkedin/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged In via LinkedIn",
      user: req.user,
    });
  } else {
    res.status(401).json({
      error: true,
      message: "Not Authorized",
    });
  }
});

// Failure routes
// Google login failure route
router.get("/login/google/failure", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Google Authentication Failed",
  });
});

// LinkedIn login failure route
router.get("/login/linkedin/failure", (req, res) => {
  res.status(401).json({
    error: true,
    message: "LinkedIn Authentication Failed",
  });
});

// Create or update user (Google/LinkedIn)
router.post("/create-user", (req, res) => {
  const { googleId, linkedinId, email, name } = req.body;
  console.log(googleId,linkedinId)
  const query = `
    INSERT INTO users (googleId, linkedinId, email, name)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE email = VALUES(email), name = VALUES(name)
  `;

  db.query(query, [googleId, linkedinId, email, name], (err, results) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).json({ error: true, message: "Database error" });
    }
    res.status(200).json({ error: false, message: "User saved successfully" });
  });
});

// to Fetch all users
router.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:");
      console.log(err)
      return res.status(500).json({ error: true, message: "Database error" });
    }
    res.status(200).json({ error: false, users: results });
  });
});

module.exports = router;
