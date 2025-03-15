const express=require("express");
const { getAllData, getAllDataList } = require("./controller");
const router=express.Router();

router.get("/show",getAllData);

router.get("/list",getAllDataList);


module.exports=router;