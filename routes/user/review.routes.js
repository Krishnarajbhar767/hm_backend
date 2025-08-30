const express = require("express");
const {
    addReview,
    getProductReviews,
    deleteReview,
    editReview,
} = require("../../controller/user/review.controller");
const reviewRouter = express.Router();

reviewRouter.post("/add", addReview);
reviewRouter.get("/:productId", getProductReviews);
reviewRouter.delete("/:id", deleteReview);
reviewRouter.put("/:reviewId", editReview);
module.exports = reviewRouter;
