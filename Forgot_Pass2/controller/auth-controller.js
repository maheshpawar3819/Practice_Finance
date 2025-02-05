const bcrypt = require("bcrypt");
const db = require("../Db/db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//route for add user
const adduser = async (req, res) => {
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
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //finding mail
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //generating token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const receiver = {
      from: "staffmfs.mdp@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `Click on this link to generate your new password ${process.env.CIENT_URL}/reset-password${token}`,
    };

    await transporter.sendMail(receiver);

    return res.status(200).json({
      message: "Password reset link send successfully on your gmail account",
    });
  } catch (error) {
    res.status(500).json({ message: "Error to send link", error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "please provide password",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    //finding user
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [
      decode.email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newHashPassword = await bcrypt.hash(password, 10);

    //update the user password
    await db.query(`UPDATE users SET password = ? WHERE email = ?`, [
      newHashPassword,
      decode.email,
    ]);

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error reset password", error });
  }
};

module.exports = { adduser, forgetPassword, resetPassword };
