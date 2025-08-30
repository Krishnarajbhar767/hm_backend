// src/controllers/wishlistController.js

const User = require("../../../model/User.model");

/**
 * Fetches the wishlist for a given userId.
 * Returns an array of populated Product documents.
 */
async function getWishlist(req, res) {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate("wishList");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If wishList is undefined, return empty array
        const items = user.wishList || [];
        return res.status(200).json(items);
    } catch (err) {
        console.error("getWishlist error:", err.message);
        return res.status(500).json({ message: "Failed to fetch wishlist" });
    }
}

/**
 * Adds a productId to a user’s wishlist array (if not already present).
 * Expects { userId, productId } in req.body.
 * Returns the updated, populated wishlist.
 */
async function addToWishlist(req, res) {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res
            .status(400)
            .json({ message: "Both userId and productId are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Only push if it isn’t already in the array
        if (!user.wishList.includes(productId)) {
            user.wishList.push(productId);
            await user.save();
        }

        // Return populated wishlist
        const updated = await User.findById(userId).populate("wishList");
        return res.status(200).json(updated.wishList);
    } catch (err) {
        console.error("addToWishlist error:", err.message);
        return res.status(500).json({ message: "Failed to add to wishlist" });
    }
}

/**
 * Removes a productId from a user’s wishlist array.
 * Expects { userId, productId } in req.body.
 * Returns the updated, populated wishlist.
 */
async function removeFromWishlist(req, res) {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res
            .status(400)
            .json({ message: "Both userId and productId are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.wishList = user.wishList.filter(
            (pid) => pid.toString() !== productId
        );
        await user.save();

        // Return populated wishlist
        const updated = await User.findById(userId).populate("wishList");
        return res.status(200).json(updated.wishList);
    } catch (err) {
        console.error("removeFromWishlist error:", err.message);
        return res
            .status(500)
            .json({ message: "Failed to remove from wishlist" });
    }
}

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};
