const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender.utils");
const expressAsyncHandler = require("express-async-handler");
const otpTemplate = require("../email/template/otpTemplate");

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // The document will be automatically deleted after 5 minutes of its creation time
    },
});

async function sendVerificationEmail(email, otp) {
    const body = otpTemplate(otp);
    const mailResponse = await mailSender(email, "Verification Email", body);
}

otpSchema.pre("save", async function (next) {
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
});
// TODO :-> Create A Function For Send Email Before

const OTP = mongoose.model("OTP", otpSchema);
module.exports = module.exports = OTP;
