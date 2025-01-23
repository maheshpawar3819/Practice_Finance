require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./Routs/authRouts");

const app = express();
app.use(bodyParser.json());

app.use("/auth", authRoutes);

const Port = process.env.PORT || 5000;
app.listen(Port, () => {
  console.log(`server is listning on port : ${Port}`);
});
