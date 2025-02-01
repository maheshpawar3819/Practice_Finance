const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "your_database",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Configure Multer for file upload (storing in 'uploads' folder)
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// API to upload image and store path in MySQL
app.post("/upload", upload.single("image"), (req, res) => {
  const imagePath = `/uploads/${req.file.filename}`;
  const sql = "INSERT INTO images (name, path) VALUES (?, ?)";
  db.query(sql, [req.file.originalname, imagePath], (err, result) => {
    if (err) throw err;
    res.send("Image uploaded successfully!");
  });
});

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// API to get image path from MySQL
app.get("/image/:id", (req, res) => {
  const sql = "SELECT path FROM images WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ imageUrl: `http://localhost:${port}${result[0].path}` });
    } else {
      res.status(404).send("Image not found");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
