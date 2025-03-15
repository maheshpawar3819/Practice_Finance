require("dotenv").config();
const express = require("express");
const app = express();
const router=require("./routes");
const cors=require("cors");

app.use(express.json());
app.use(cors());

app.use("/api",router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server is listing on port", port);
});
