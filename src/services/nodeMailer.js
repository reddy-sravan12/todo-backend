require('dotenv').config()

const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.OTP_USER,
    pass: process.env.OTP_PASSWORD,
  },
});


const sendOtp=async(email,otp)=>{
return transporter.sendMail({
    from: `Sravan <${process.env.OTP_USER}>`,
    to: email,
    subject: "verify OTP",
    text: `${otp}`, // plain‑text body
    html: `<b>verification otp:${otp}</b>`, // HTML body
  });
}

module.exports={sendOtp}