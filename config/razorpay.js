const dotenv = require("dotenv");
const Razorpay = require("razorpay");
dotenv.config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

module.exports = razorpayInstance;
