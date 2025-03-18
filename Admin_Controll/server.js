require("dotenv").config();
const express=require("express");
const cors=require("cors");
const adminRoute=require("./route/adminRoute");


const app=express();
app.use(express.json());
app.use(cors());

//routes
app.use("/admin",adminRoute);

const port=process.env.PORT || 8080;
app.listen(port,() => {
    console.log("server is listning on port",port);
})