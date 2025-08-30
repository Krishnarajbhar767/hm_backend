const express = require("express");
const {
    removeFromWishlist,
    getWishlist,
    addToWishlist,
} = require("../../controller/user/wishlist/wishlist.controller");

const wishlistRouter = express.Router();
wishlistRouter.get("/:userId", getWishlist);
wishlistRouter.post("/add", addToWishlist);
wishlistRouter.post("/remove", removeFromWishlist);

module.exports = wishlistRouter;
