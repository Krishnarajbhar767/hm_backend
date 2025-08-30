const express = require("express");
const {
    checkoutHandler,
    paymentVerificationHandler,
    updatePaymentStatus,
} = require("../controller/payment.controller");
const paymentRoutes = express.Router();
paymentRoutes.post("/checkout", checkoutHandler);
paymentRoutes.post("/verify-payment", paymentVerificationHandler);
paymentRoutes.put("/:id/payment-status", updatePaymentStatus);
paymentRoutes.get("/get-razorpay-key", (req, res) => {
    res.status(200).json({
        key: process.env.RAZORPAY_ID,
    });
});
module.exports = paymentRoutes;
