const OTP = require("../model/Otp.model");

const otpGenerator = require("otp-generator");
const generateOtp = async () => {
    let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });

    let result = await OTP.findOne({ otp: otp });

    while (result) {
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        result = await OTP.findOne({ otp: otp });
    }
    console.log(otp);
    return otp;
};

module.exports = generateOtp;
