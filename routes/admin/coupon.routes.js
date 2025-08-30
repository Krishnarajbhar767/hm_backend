const express = require("express");
const {
    createCoupon,

    deleteCoupon,
    updateCoupon,
    getAllCoupans,
} = require("../../controller/admin/coupon.controller");

const couponRouter = express.Router();
couponRouter.get("/", getAllCoupans);
couponRouter.post("/create", createCoupon);
couponRouter.delete("/:id", deleteCoupon);
couponRouter.put("/:id", updateCoupon);

module.exports = couponRouter;
