const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
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
offerSchema.virtual("isExpired").get(function () {
    const now = new Date();
    const ageLimit = this.maxAge * 60 * 60 * 1000; // convert hours to ms
    return now - this.createdAt > ageLimit;
});

// Optional: include virtuals when converting to JSON
offerSchema.set("toJSON", { virtuals: true });
offerSchema.set("toObject", { virtuals: true });

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
