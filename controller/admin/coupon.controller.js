const express = require("express");
const Coupon = require("../../model/Coupon.model");

const createCoupon = async (req, res) => {
    // get data from Body ->Code, discount (%),maxAge (in Hour),max usage limit
    const { code, discount, maxAge, maxUsageLimit, status = false } = req.body;
    if (!code || !discount || !maxAge || !maxUsageLimit) {
        return res.error("Something went wrong,Please check all details");
    }
    try {
        // Find Dose Same Coupon ALready Exit Or Not ?
        const alreadyExit = await Coupon.findOne({ code: code?.toLowerCase() });
        if (alreadyExit) return res.error("Coupon code already exit", 400);
        const coupon = await Coupon.create({
            code,
            discount,
            maxAge,
            maxUsageLimit,
            status,
        });
        return res.success("Coupon created successfully.", coupon);
    } catch (error) {
        console.log("error while creating  coupon", error);
        return res.error("Something went wrong");
    }
};

const getAllCoupans = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return res.success("Coupons fetched successfully.", coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        return res.error("Something went wrong while fetching coupons.");
    }
};
const updateCoupon = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const now = new Date();
        const updated = await Coupon.findByIdAndUpdate(
            id,
            { ...updateData, createdAt: now, usageCount: 0 },

            {
                new: true,
            }
        );
        if (!updated) return res.error("Coupon not found.", 404);
        return res.success("Coupon updated successfully.", updated);
    } catch (error) {
        console.error("Error updating coupon:", error);
        return res.error("Something went wrong while updating coupon.");
    }
};

const deleteCoupon = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Coupon.findByIdAndDelete(id);
        if (!deleted) return res.error("Coupon not found.", 404);
        return res.success("Coupon deleted successfully.");
    } catch (error) {
        console.error("Error deleting Coupon:", error);
        return res.error("Something went wrong while deleting Coupon.");
    }
};

module.exports = {
    createCoupon,

    getAllCoupans,
    updateCoupon,
    deleteCoupon,
};
