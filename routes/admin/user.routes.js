const express = require("express");
const { getAllUsers } = require("../../controller/admin/user.controller");
const userRouter = express.Router();
userRouter.get("/all-user", getAllUsers);
module.exports = userRouter;
