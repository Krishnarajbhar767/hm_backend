
const Razorpay = require("razorpay");

const dotenv = require("dotenv");
dotenv.config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

module.exports = razorpayInstance;
