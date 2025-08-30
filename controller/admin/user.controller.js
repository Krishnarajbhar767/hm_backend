const User = require("../../model/User.model");
const asyncHandler = require("express-async-handler");
// Users
exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    if (!users) {
        return res.errored("Users Not Found");
    }
    return res.success("User fetched successfully", users);
});
