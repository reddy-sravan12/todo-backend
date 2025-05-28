const express=require('express');
const authRouter=express.Router();

const {postSignUpRequest,postLogInRequest,verifyOtp}=require('../controllers/authContoller')



authRouter.post('/signUp',postSignUpRequest)
authRouter.post('/login',postLogInRequest)
authRouter.post('/verify-otp',verifyOtp)


module.exports=authRouter;