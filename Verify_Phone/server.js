require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const twilio = require("twilio");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//twilio config
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

//db connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

//generate otp
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// api for otp send
app.post("/send-otp", (req, res) => {
  const { phone_number } = req.body;
  const otp = generateOtp();
  const otp_expires_at = new Date(Date.now() + 5 * 60000); //EXPIRES IN 5 MINUETES

  //save otp in db
  db.query(
    `INSERT INTO users (phone_number, otp, otp_expires_at) VALUES (?,?,?) ON DUPLICATE KEY UPDATE otp=?,otp_expires_at = ?`,
    [phone_number, otp, otp_expires_at, otp, otp_expires_at],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error", details: err });
      }

      //send otp via twilo
      client.messages
        .create({
          body: `Your OTP is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone_number,
        })
        .then(() => {
          res.json({ message: "OTP sent successfully" });
        })
        .catch((err) => {
          res.status(500).json({ error: "Failed to send OTP", details: err });
        });
    }
  );
});

//verify otp

app.post("/verify-otp", (req, res) => {
  const { phone_number, otp } = req.body;

  db.query(
    `SELECT * FROM users WHERE phone_number = ?`,
    [phone_number],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ error: "Phone number not found" });
      }

      const user = results[0];
      if (user.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      if (new Date(user.otp_expires_at) < new Date()) {
        return res.status(400).json({ error: "OTP expired" });
      }

      // Update user as verified
      db.query(
        `UPDATE users SET is_verified = TRUE ,otp =NULL ,otp_expires_at = NULL WHERE phone_number = ?`,
        [phone_number],
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Database update failed" });
          }
          res.json({ message: "Phone number verified successfully" });
        }
      );
    }
  );
});

const port = process.env.PORT || 5000;
//server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
