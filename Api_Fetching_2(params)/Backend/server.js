require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db=require("./DB/db");
const routers=require("./Routes/routes");


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//routes
app.use("/api",routers);

//db connection
db.connect((err) => {
    if (err) {
      console.log(`cannot connect to database`);
    }
    console.log(`Connect to Database...`);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is listning on port : ${PORT}`);
});
