require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routers=require("./routes/authRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",routers);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listning on port ${port}`);
});
