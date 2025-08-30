const express = require("express");
const { isAuthenticated } = require("../../middleware/auth.middleware");
const cartRouter = require("./cart.routes");
const wishlistRouter = require("./wishlist.routes");
const { orderRouter } = require("./order.routes");
const addressRouter = require("./adress.routes");
const reviewRouter = require("./review.routes");
const couponRouter = require("./coupon.routes");
const userRoutes = express.Router();
const User = require('../../model/User.model')
userRoutes.use("/cart", isAuthenticated, cartRouter);
userRoutes.use("/wishlist", isAuthenticated, wishlistRouter);
userRoutes.use("/orders", isAuthenticated, orderRouter);
userRoutes.use("/address", isAuthenticated, addressRouter);
userRoutes.use("/review", isAuthenticated, reviewRouter);
userRoutes.use("/coupon", couponRouter);
userRoutes.put('/update-profile', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id; // Get the user ID from the JWT payload
        // Define a list of allowed fields to update to prevent malicious updates
        const allowedUpdates = ['firstName', 'lastName', 'dob', 'gender'];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        // Step 3: Check if any valid fields were actually provided
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
        }

        // Find the user by ID and update the allowed fields
        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Send back the updated user data (excluding sensitive information like password)
        const updatedUser = user.toObject();
        delete updatedUser.password;
        delete updatedUser.forgotPasswordToken;
        delete updatedUser.refreshToken;

        res.status(200).json({ success: true, message: 'Profile updated successfully.', user: updatedUser });

    } catch (error) {
        // Handle validation errors from Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server error occurred while updating profile.' });
    }
});
module.exports = userRoutes;
