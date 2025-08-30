const express = require("express");
const { applyCoupon } = require("../../controller/user/coupon.controller");

const couponRouter = express.Router();

couponRouter.post("/apply", applyCoupon);

module.exports = couponRouter;
