require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { google } = require("googleapis");
const db = require("../Db/db");

const router = express.Router();

// OAuth2 Setup for Gmail
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Generate an access token using OAuth2
const accessToken = async () => {
  const { token } = await oauth2Client.getAccessToken();
  return token;
};

// Email transport setup using OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER, // Your email address
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: accessToken,
  },
});

// Route for adding a user
router.post("/add-user", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Check if the user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await db.query(
      "INSERT INTO users (email, password, resetToken, resetTokenExpires) VALUES (?, ?, NULL, NULL)",
      [email, hashedPassword]
    );

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
});

// Request to password reset
router.route("/forgot-password").post(async (req, res) => {
  try {
    const { email } = req.body;

    console.log(email);
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expiryTime = new Date(Date.now() + 3600000); // 1 hour expiration time

    await db.query(
      `UPDATE users SET resetToken = ?, resetTokenExpires = ? WHERE email = ?`,
      [hashedToken, expiryTime, email]
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Send the reset link via email using OAuth2
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    return res.json({
      message: "Reset link sent to your email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// Reset password
router.route("/reset-password/:token").post(async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [rows] = await db.query(
      "SELECT * FROM users WHERE resetToken = ? AND resetTokenExpires > NOW()",
      [hashedToken]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE users SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE id = ?`,
      [hashPassword, rows[0].id]
    );

    // Send response
    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
