require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./DB/db");
const routers = require("./Routes/routes");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//routes
app.use("/api", routers);

//db connection
db.getConnection()
  .then((connection) => {
    console.log(`Connected to Database...`);
    connection.release();
  })
  .catch((err) => {
    console.log(`Cannot connect to database`, err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is listning on port : ${PORT}`);
});
