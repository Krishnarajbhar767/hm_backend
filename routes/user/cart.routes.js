const express = require("express");
const {
    addToCart,
    removeFromCart,
    mergeCart,
    getCart,
    updateQuantity,
} = require("../../controller/user/cart/cart.controller");
const cartRouter = express.Router();
cartRouter.get("/:userId", getCart);
cartRouter.post("/add", addToCart);
cartRouter.post("/remove", removeFromCart);
cartRouter.post("/merge", mergeCart);
cartRouter.post("/update-quantity", updateQuantity);
module.exports = cartRouter;
