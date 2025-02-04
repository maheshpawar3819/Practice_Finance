require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const auth = require("./Routes/auth");

app.use(express.json());
app.use(cors());

app.use("/api/auth", auth);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listning on port ${port}`);
});
