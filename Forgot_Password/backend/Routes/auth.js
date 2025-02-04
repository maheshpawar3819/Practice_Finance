require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const db = require("../Db/db");

const router = express.Router();

//email transport setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//route for add user
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

//request to password reset
router.route("/forgot-password").post(async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [
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
    const expiryTime = new Date(Date.now() + 3600000); //for 1 hr

    await db.query(
      `UPDATE users SET resetToken = ?,resetTokenExpires=? WHERE email= ? `,
      [hashedToken, expiryTime, email]
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    //send resonse
    res.json({
      message: "reset link send to your email",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

//reset password
router.route("/reset-password/:token").post(async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [rows] = await db.query(
      `SELECT * FROM users WHERE resetToken = ? AND resetTokenExpires > NOW()`,
      [hashedToken]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE users SET password = ?,resetToken=NULL ,resetTokenExpires=NULL WHERE id=?`,
      [hashPassword, rows[0].id]
    );

    //send response
    res.json({
      message: "Password Reset Successfull",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
