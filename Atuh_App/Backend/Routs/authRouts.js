const express=require("express");
const router=express.Router();
const authController=require("../Controller/authController");


//routes
router.post('/google',authController.googleSignIn);
router.post('/linkedin',authController.linkedinSignIn);


module.exports=router;