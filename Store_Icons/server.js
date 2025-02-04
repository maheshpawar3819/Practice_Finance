require("dotenv").config();
const express = require("express");
const app = express();
// const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

const port = 8080;
//icons folder path
const iconsFolder =
  "C:/Users/pawar/OneDrive/Desktop/Intern/Stock_Images/500nifty";

//mysql connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.log(`Database connection failed:`, err);
  }
  console.log("Successfully connect to database");
});

// Read all files in the icons folder
fs.readdir(iconsFolder, (err, files) => {
  if (err) {
    console.error("Error reading folder:", err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(iconsFolder, file);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(`Error reading file ${file}:`, err);
        return;
      }

      db.query(
        `INSERT INTO icons2 (name,image) VALUES (?,?)`,
        [file, data],
        (err) => {
          if (err) {
            console.error(`Error inserting ${file}:`, err);
          } else {
            console.log(`Inserted ${file} successfully`);
          }
        }
      );
    });
    console.log(`All icons upload successfully`);
  });
});

app.listen(port, () => {
  console.log(`server is listning on port : ${port}`);
});
