const express = require("express");
const { getOrdersByUser } = require("../../controller/user/order.controller");
const orderRouter = express.Router();
orderRouter.get("/:userId", getOrdersByUser);
module.exports = {
    orderRouter,
};
