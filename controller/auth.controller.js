const asyncHandler = require("express-async-handler");
const User = require("../model/User.model");
const generateOtp = require("../utils/otpGenerator.utils");
const OTP = require("../model/Otp.model");
const bcrypt = require("bcryptjs");
const mailSender = require("../utils/mailSender.utils");
const registrationSuccessTemplate = require("../email/template/registrationSuccessTemplate");
const getSessionDetails = require("../utils/getSessionDetails");
const loginAlertTemplate = require("../email/template/loginAlertTemplate");
const getCurrentDateTime = require("../utils/getCurrentDateTime");
const forgotPasswordTemplate = require("../email/template/fogotPasswordTemplate");
const jwt = require("jsonwebtoken");
const passwordChangeSuccessTemplate = require("../email/template/passwordChangeSuccessTemplate");
require("dotenv").config();

const generateTokenAndRefereshTokens = asyncHandler(async (userId) => {
    const user = await User.findById(userId);
    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { token, refreshToken };
});

exports.sendOtp = asyncHandler(async (req, res) => {
    // get email
    const { email } = req.body;
    // check is Email Have Or Not if have then go forward or return errr;
    if (!email) {
        return res.error("Email is required", 401);
    }
    // check is user already exit or not if user already exit then return error otherwise go forward
    const isUserAlreadyExit = await User.findOne({ email });
    if (isUserAlreadyExit) {
        return res.error("User Already Exit", 401);
    }
    // genrate unique OTP
    let otp = await generateOtp();

    // Save OTP In Database With Email And Send Response SuccessFull..
    const otpPayload = { otp, email };
    // Delete All Otp Before Saving New Otp
    await OTP.deleteMany({ email });
    const newOtp = await OTP.create(otpPayload);
    return res.success("Otp Generated Successfully", newOtp);
});

// Controller function to handle user registration
exports.registerUser = asyncHandler(async (req, res) => {
    // Destructure fields from request body
    const { phone, password, confirmPassword, otp } = req.body;
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const firstName = req.body.firstName.trim().toLowerCase();
    const lastName = req.body.lastName.trim().toLowerCase();
    // 400 Bad Request – Missing required fields
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword ||
        !otp
    ) {
        return res.error("All fields are required.", 400);
    }

    // 400 Bad Request – Passwords don't match
    if (password !== confirmPassword) {
        return res.error("Password does not match.", 400);
    }
    // 409 Conflict – User already exists
    const isUserAlreadyExist = await User.findOne({ email });

    if (isUserAlreadyExist) {
        return res.error("User already exists.", 409);
    }

    // 404 Not Found – OTP record not found (expired or never generated)
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
        return res.error(
            "OTP record not found (expired or never generated)",
            404
        );
    }

    // 400 Bad Request – OTP provided does not match
    if (otpRecord.otp !== otp) {
        return res.error("OTP does not match.", 400);
    }

    // Prepare user data for DB
    const userPayload = {
        firstName,
        lastName,
        email,
        phone,
        password,
    };

    // Save new user
    const newUser = await User.create(userPayload);
    // newUser.save();
    // Send registration success email
    await mailSender(
        newUser.email,
        "Welcome to Himalaya Carpets – Your Registration is Complete!",
        registrationSuccessTemplate(`${newUser.firstName} ${newUser.lastName}`)
    );

    // 201 Created – Resource successfully created
    return res.success("User created successfully.", newUser);
});

// User Login Handler

exports.login = asyncHandler(async (req, res) => {
    console.log("req.body", req.body);

    const { password } = req.body;
    const email = req.body?.email.trim().toLowerCase();

    // Check all Required Field Are Available Or Not.
    if (!email || !password) {
        return res.error("All Field Are Required.", 400);
    }

    // Check Is User Exit Or Not
    const user = await User.findOne({ email });

    if (!user) {
        return res.error("User Dose Not Exit!");
    }

    // Check Is User Password Are Same Or Not ?
    // ---> Compare User Password And  Input Password By bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return res.error("Password dose not match", 403);
    }

    // Generate Token For User
    const { token, refreshToken } = await generateTokenAndRefereshTokens(
        user._id
    );

    // send login alert to user
    const session = getSessionDetails(req);

    await mailSender(
        user.email,
        "Alert: A New Login Was Detected on Your Account",
        loginAlertTemplate(
            `${user.firstName} ${user.lastName}`,
            session.device,
            session.location,
            session.ip,
            getCurrentDateTime()
        )
    );
    const userData = user.toObject();
    delete userData.password; // Don't expose hashed password
    delete userData.__v;
    delete userData.refreshToken;
    // const options = {
    //     httpOnly: true,
    //     secure: false, // ✅ for localhost
    //     sameSite: "Lax", // ✅ for localhost
    // };

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // true on production, false on localhost
        sameSite: "Lax", // "None" needed for cross-origin
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true on production, false on localhost
        sameSite: "Lax", // "None" needed for cross-origin
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.success(`Welcome ${user.firstName}`, {
        user: userData,
        token,
    });
});

// Handler FOr Handle Change Password From Profile Of User After Login
exports.changePassword = asyncHandler(async (req, res) => {
    // get user old password new password confirm Password and token
    const { oldPassword, password, confirmPassword } = req?.body;
    if (!password || !confirmPassword || !oldPassword) {
        return res.error("All fields are required", 404);
    }

    if (password !== confirmPassword) {
        return res.error(
            "Your New Password And Confirm Password Do Not Match.",
            403
        );
    }
    console.log(req.user._id);
    const userDetails = await User.findById(req?.user?._id);

    if (!userDetails) {
        return res.error(
            "User Not Found Something Went Wrong! Please Try Again.",
            403
        );
    }
    // Check Is BOth Password Are Same Or NOt New - confirmPassword
    const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
    );

    if (!isPasswordMatch) {
        return res.error(
            "Your Old Passoword And New Password Dose Not Match.",
            403
        );
    }

    const isNewPasswordSame = await bcrypt.compare(
        password,
        userDetails.password
    );

    // ALso Check Your NewPassword Should Not Be Your Old Password Again
    if (isNewPasswordSame) {
        return res.error("Old Password New Password Are Same.", 403);
    }
    // If Not Match Then  Save User Details
    userDetails.password = password;
    await userDetails.save();
    await mailSender(
        userDetails?.email,
        "Himalaya Carpets | Password Changed Successfully.",
        passwordChangeSuccessTemplate(`${userDetails.firstName} `)
    );
    //Send Response
    return res.success("Password Changed Successfully", userDetails);
});

// Controller For handle Token Generation For Password Reset ->
exports.forgotPasswordToken = asyncHandler(async (req, res) => {
    // get user email find them
    const { email } = req.body;
    if (!email) {
        return res.error("Please Provide Email.", 404);
    }
    // if user not exit then throw error
    const userDetails = await User.findOne({ email });
    // if user exit then send i token  to user on email
    if (!userDetails) {
        return res.error("User Dose Not Exit!", 403);
    }
    // set expiry time for reset token
    const token = crypto.randomUUID();
    userDetails.forgotPasswordToken = {
        value: token,
        expiresAt: new Date(Date.now() + 900000), // expires after 15 min
    };
    await userDetails.save();
    // send email with reset token on email
    const URL = `${process.env.FRONTEND_URL}reset-password/${token} `;
    await mailSender(
        email,
        "Reset Password Link -  Fabs",
        forgotPasswordTemplate(URL)
    );
    return res.success("Reset link sent! Check your email.");
    // send success response to admin
});

// Forgot Password Handler For Handle Password Change By Token
exports.forgotPassword = asyncHandler(async (req, res) => {
    // get password and confirm password and token
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    console.log(password, confirmPassword);
    if (!token) {
        return res.error("Something Went Wrong. Reset Token Is Missing", 403);
    }
    // check for password confirm password
    if (!password || !confirmPassword) {
        return res.error("All fields are required");
    }
    // check for token

    // check is password and confirm password are same or not ?
    if (password !== confirmPassword) {
        return res.error("Password And Confirm Password Dose Not Match", 403);
    }
    // find user by token
    const userDetails = await User.findOne({
        "forgotPasswordToken.value": token,
    });

    if (!userDetails) {
        return res.error("User Not Found!. Please Try Again", 403);
    }
    const isPreviousPassword = await bcrypt.compare(
        password,
        userDetails.password
    );
    // before saving new password check is new password or password are not Same
    if (isPreviousPassword) {
        return res.error(
            "Your Old Password And New Password Are Same. Try Another",
            403
        );
    }
    // check is token is valid or not ? I Mean Expired or not
    if (userDetails.forgotPasswordToken.value !== token) {
        return res.error(
            "Token Not Matched. Please Generate New Or Try Again.",
            401
        );
    }

    if (!(userDetails.forgotPasswordToken.expiresAt > Date.now())) {
        return res.error(
            "Reset link Is Expired! Please Generate New Link",
            400
        );
    }

    // if token is valid new passowrd previuos passowrd are not same then save new password
    userDetails.password = password;
    userDetails.forgotPasswordToken.value = null;
    userDetails.forgotPasswordToken.expiresAt = null;
    await userDetails.save();
    await mailSender(
        userDetails?.email,
        "Himalaya Carpets | Password Changed Successfully.",
        passwordChangeSuccessTemplate(`${userDetails.firstName} `)
    );
    return res.success("Password Changed Successfully.");
});

// exports.logoutUser = async (req, res) => {
//     try {
//         console.log('Logout Api ->', req.user)
//         await User.findByIdAndUpdate(
//             req.user._id,
//             {
//                 $unset: {
//                     refreshToken: 1, // this removes the field from document
//                 },
//             },
//             {
//                 new: true,
//             }
//         );

//         const options = {
//             httpOnly: true,
//             secure: true,
//         };

//         res.clearCookie("token", options).clearCookie("refreshToken", options);
//         return res.success("User logged Out");
//     } catch (error) {
//         console.log('Error While Logout', error)
//         return res.status(500).json({
//             error
//         })
//     }
// };
exports.logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET
            );
            await User.findByIdAndUpdate(decoded._id, {
                $unset: { refreshToken: 1 },
            });
        }

        res.clearCookie("token", { httpOnly: true, secure: false });
        res.clearCookie("refreshToken", { httpOnly: true, secure: false });

        return res.success("User logged out");
    } catch (error) {
        console.log("Logout error:", error.message);
        return res.success("Logged out"); // still success, even if error
    }
};

exports.regenerateToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req?.cookies?.refreshToken;
    console.log("Refresh token ->", incomingRefreshToken);
    console.log("Refresh token API Cookies->", req.cookies);
    if (!incomingRefreshToken) {
        return res.error("Unauthorized request", 400);
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return res.error("Invalid refresh token", 400);
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res.error("Refresh token is expired or used...", 400);
        }

        const { token, refreshToken: newRefreshToken } =
            await generateTokenAndRefereshTokens(user._id);

        res.cookie("token", token, { httpOnly: true, secure: true }).cookie(
            "refreshToken",
            newRefreshToken,
            { httpOnly: true, secure: true }
        );

        return res.success("Access token refreshed", token);
    } catch (err) {
        return res.error("Invalid or expired refresh token", 400);
    }
});

exports.getUserDetails = asyncHandler(async (req, res) => {
    const userId = req?.user?._id || req.body.userId;
    if (!userId) {
        return res.error("Unauthorised Access", 401);
    }
    const userDetails = await User.findById(userId).select(
        "-password -refreshToken"
    );

    if (!userDetails) {
        return res.error("Unauthorised Acces User Not Found", 401);
    }
    return res.success("User Fetched Successfully..", userDetails);
});

exports.resetPassValidateToken = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.error("Reset token is missing", 400);
    }

    const user = await User.findOne({
        "forgotPasswordToken.value": token,
    });

    if (!user) {
        return res.error("Invalid or expired reset token", 400);
    }

    if (user.forgotPasswordToken.expiresAt < new Date()) {
        return res.error("Reset token has expired", 400);
    }

    return res.success("Reset token is valid");
});
