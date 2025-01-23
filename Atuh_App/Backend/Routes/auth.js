const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require("../server");


// Login success route
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: req.user,
    });
  } else {
    res.status(401).json({
      error: true,
      message: "Not Authorized",
    });
  }
});

// Create a new user in the database
router.post("/create-user", (req, res) => {
  const { googleId, linkedinId, email, name } = req.body;

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

// Fetch all users
router.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: true, message: "Database error" });
    }
    res.status(200).json({ error: false, users: results });
  });
});


module.exports = router;
