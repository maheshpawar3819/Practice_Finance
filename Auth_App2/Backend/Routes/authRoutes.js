const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../Config/db");
const { initializePassport } = require("../Utils/passportConfig");

initializePassport(passport);
const router = express.Router();

// Google Authentication route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    return res.status(200).json({
      error: false,
      message: "successfully loggin with google",
    });
  }
);

// LinkedIn Authentication route
router.get(
  "/linkedin",
  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
  })
);
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/" }),
  (req, res) => {
    return res.status(200).json({
      error: false,
      message: "successfully loggin with google",
    });
  }
);

// Local Login route
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  }
);

// Signup route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ message: "User created" });
    }
  );
});

module.exports = router;
