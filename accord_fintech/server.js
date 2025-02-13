require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors);

app.use("/data",(req,res) => {
    try {
        
    } catch (error) {
        console.log(error);
    }
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is listning on port ${port}`);
});
