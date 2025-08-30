const Product = require("../../model/Product.model");
const Order = require("../../model/Order.model");
const Category = require("../../model/Category.model");
const Payment = require("../../model/Payment.model");
const User = require("../../model/User.model");
const Review = require("../../model/Review.model");
const getOverview = async (req, res) => {
    try {
        // 1) lowStockProducts: products with stock <= 5
        const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
            .select("name stock")
            .lean();

        // 2) totalRevenue: sum of totalAmount for orders paymentStatus = "Paid"
        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: "Paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // 3) pendingOrders: orders with paymentStatus = "Pending"
        const pendingOrders = await Order.find({ paymentStatus: "Pending" })
            .select("_id createdAt")
            .lean();

        // 4) averageRating: average of all review ratings
        const ratingResult = await Review.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ]);
        const averageRating = Number(
            (ratingResult[0]?.avgRating || 0).toFixed(2)
        );

        // 5) totalProducts: count of all products
        const totalProducts = await Product.countDocuments();

        // 6) activeUsers: count of users who have at least one item in cart
        const activeUsers = await User.countDocuments({
            "cart.items.0": { $exists: true },
        });

        // 7) orderStats: breakdown by deliveryStatus
        const orderStats = await Order.aggregate([
            { $group: { _id: "$deliveryStatus", count: { $sum: 1 } } },
        ]);

        // 8) topSellingProducts: sum quantities per product across all orders, top 5
        const topSellingAgg = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    sales: { $sum: "$items.quantity" },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            { $project: { _id: 0, name: "$product.name", sales: 1 } },
            { $sort: { sales: -1 } },
            { $limit: 5 },
        ]);

        res.json({
            lowStockProducts,
            totalRevenue,
            pendingOrders,
            averageRating,
            totalProducts,
            activeUsers,
            orderStats,
            topSellingProducts: topSellingAgg,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getOverview,
};
