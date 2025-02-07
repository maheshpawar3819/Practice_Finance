require("dotenv").config();
const express = require("express");
const cors = require("cors");
const searchRoutes = require("./Routes/search-route");

const app = express();
app.use(cors());
app.use(express.json());

//routes
app.use("/api", searchRoutes);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listning on port : ${PORT}`);
});
