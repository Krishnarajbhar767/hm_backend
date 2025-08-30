const Review = require("../../model/Review.model");
const Order = require("../../model/Order.model");
const Product = require("../../model/Product.model");
const mongoose = require("mongoose");
// Add Review
exports.addReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { product: productId, rating, comment } = req.body;

        // Validate input
        if (!productId || !rating || !comment) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if user has already reviewed
        const alreadyReviewed = await Review.findOne({
            user: userId,
            product: productId,
        });
        if (alreadyReviewed) {
            return res
                .status(400)
                .json({ error: "You have already reviewed this product" });
        }

        // Check if user has bought and received the product
        const productObjectId = new mongoose.Types.ObjectId(String(productId));

        const orders = await Order.find({
            user: userId,
            "items.product": productObjectId,
            deliveryStatus: "Delivered",
        });

        if (!orders.length) {
            return res
                .status(403)
                .json({ error: "You can only review delivered products" });
        }

        // Create and save review
        const newReview = await Review.create({
            user: userId,
            product: productId,
            rating,
            comment,
        });

        // Add review ID to product
        product.reviews.push(newReview._id);
        await product.save();

        res.status(201).json({ message: "Review added", review: newReview });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Reviews for a Product
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId }).populate(
            "user",
            "firstName lastName avatar"
        );
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  Delete Review (Admin or Self)
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Check ownership
        if (
            review.user.toString() !== req.user._id.toString() &&
            !req.user.isAdmin
        ) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await Review.findByIdAndDelete(id);

        // Remove review from product
        await Product.findByIdAndUpdate(review.product, {
            $pull: { reviews: review._id },
        });

        res.status(200).json({ message: "Review deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!rating || rating < 1 || rating > 5) {
            return res
                .status(400)
                .json({ error: "Rating must be between 1 and 5." });
        }
        if (
            !comment ||
            typeof comment !== "string" ||
            comment.trim().length === 0
        ) {
            return res.status(400).json({ error: "Comment is required." });
        }

        // Find the review
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found." });
        }

        // Check if current user is the owner
        if (review.user.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ error: "You are not authorized to edit this review." });
        }

        // Update fields
        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.status(200).json({
            message: "Review updated successfully.",
            review,
        });
    } catch (err) {
        console.error("Edit review error:", err);
        res.status(500).json({ error: "Server error." });
    }
};
