const express=require("express");
const {addStockHome,addAnaylistData} = require("../controller/adminController");
const router=express.Router();

router.route('/home-table').post(addStockHome);

router.route('/stock-anaylist').post(addAnaylistData);

module.exports=router;