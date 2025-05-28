const {check,validationResult}=require("express-validator")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SignUp=require('../models/authModel');
const { sendOtp } = require("../services/nodeMailer");

const postSignUpRequest = [
    check('userName').notEmpty().withMessage("username is required"),
    check('email').isEmail().withMessage("pleasse provide a valid email"),
    check('password')
    .notEmpty().withMessage("password is required")
    .isLength({min:6}).withMessage("password must be at least 6 characters long")
    .matches(/[a-z]/).withMessage("password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("password must contain at least one number")
    .matches(/[@$!%*?&]/).withMessage("password must contain at least one special character")
    .trim(),
    check('confirmPassword').trim().custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error("passwords do not match")
        }
        return true;
    }),
    check('profession')
    .notEmpty().withMessage("profession is required")
    .isIn(["Developer", "Designer", "Manager", "Student","Other"])
    .withMessage("profession must be one of the following: student, teacher, developer, other"),

    (req, res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(),message:"Validation failed" });
    }else{
        const newUser=new SignUp(req.body.userName, req.body.password, req.body.email, req.body.profession);
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err, message:"Error hashing password" });
            }
            newUser.password = hash;
            newUser.save();
            res.status(201).send({status:"User signed up successfully"});
        });
    }

    // res.send("<h1>Sign Up Page</h1>");
}]

const verifyOtp=async(req,res)=>{
    const {otp,email}=req.body
    SignUp.handleLogin(email).then((user)=>{
        if(!user){
            return res.status(400).json({error:"User not found", message:"Please sign up first"});
        }
        if(user.otp === Number(otp)){
            const jwtPayload={
                userId:user._id,
                email:user.email,
                userName:user.userName,
                profession:user.profession
            }
            const jwtToken=jwt.sign(jwtPayload,process.env.JWT_SECRET,{expiresIn:'1h'});
            if(jwtToken){
                SignUp.removeOtp(email).then(()=>{
                    return res.status(200).json({
                        message: "Login successful",
                        token: jwtToken,
                        user: {
                          userName: user.userName,
                          email: user.email,
                          profession: user.profession,
                          userId: user._id,
                        },
                      });
                      
                }).catch((err)=>{
                    return res.status(500).json({error:"db connection failed", message:"Error connecting to db"});
                });
                
            }else{
                return res.status(400).json({error:"Please try again", message:"Error generating token"});
            }
        }else{
            return res.status(400).json({error:"Invalid OTP", message:"Please try again"});
        }
    })
}

const postLogInRequest = async (req, res) => {
    const user = await SignUp.handleOtp(req.body.email, req.body.password);
    if (!user) {
      return res.status(400).json({ error: "wrong credentials", message: "User not found" });
    }
  
    const userPassword = user.password;
    const isValidPassword = await bcrypt.compare(req.body.password, userPassword);
  
    if (isValidPassword) {
      const randSixNum = Math.floor(100000 + Math.random() * 900000); // ensure it's 6-digit
  
      sendOtp(user.email, randSixNum).then((otpResponse) => {
        if (otpResponse && otpResponse.rejected && otpResponse.rejected.length === 0) {
          SignUp.updateOtpToUser(user.email, randSixNum).then(() => {
            return res.status(200).json({
              message: "Verification OTP sent",
            });
          });
        } else {
          return res.status(401).json({
            message: "Verification OTP sending failed",
          });
        }
      }).catch((err) => {
        console.error("Error sending OTP:", err);
        return res.status(500).json({ message: "Internal error while sending OTP" });
      });
  
    } else {
      return res.status(400).json({ error: "Invalid password" });
    }
  };
  



module.exports = {
    postSignUpRequest,postLogInRequest,verifyOtp
};