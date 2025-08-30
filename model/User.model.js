const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const cartSchema = new mongoose.Schema({
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            finalPrice: {
                type: Number,
                required: true,
                default: 0,
            },
            addons: {
                withFallPico: {
                    type: Boolean,
                    default: false,
                },
                withTassels: {
                    type: Boolean,
                    default: false,
                },
            },
            totalPrice: {
                type: Number,
                required: true,
                default: 0,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
});

const userSchema = new mongoose.Schema(
    {
        avatar: {
            type: String,
        },
        firstName: {
            type: String,
            required: true,
            lowercase: true,
        },
        lastName: {
            type: String,
            required: true,
            lowercase: true,
        },
        dob: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            match: [
                /^[1-9][0-9]{9}$/,
                "Please enter a valid 10-digit phone number that does not start with 0",
            ],
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        shippingAddress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Address",
                required: true,
            },
        ],
        defaultAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },
        cart: {
            type: cartSchema,
            default: () => ({}),
        },
        wishList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        ],
        gender: {
            type: String,
            enum: ['male', 'female'],
            lowercase: true
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        forgotPasswordToken: {
            value: { type: String },
            expiresAt: { type: Date },
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
    );
};

userSchema.methods.generateRefreshToken = function name() {
    return jwt.sign(
        {
            _id: this._id,
            isAdmin: this.isAdmin,
            email: this.email,
            role: this.role,
        },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};
const User = mongoose.model("User", userSchema);

module.exports = User;
