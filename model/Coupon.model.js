const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    maxAge: {
        type: Number, // in hours
        required: true,
        min: 1,
    },
    maxUsageLimit: {
        type: Number,
        required: true,
        min: 1,
    },
    usageCount: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add a virtual field to check if the coupon is expired
couponSchema.virtual("isExpired").get(function () {
    const now = new Date();
    const ageLimit = this.maxAge * 60 * 60 * 1000; // convert hours to ms
    return now - this.createdAt > ageLimit;
});

// Optional: include virtuals when converting to JSON
couponSchema.set("toJSON", { virtuals: true });
couponSchema.set("toObject", { virtuals: true });

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
