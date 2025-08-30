const Order = require("../../model/Order.model");

async function getOrdersByUser(req, res) {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("items.product")
            .populate("shippingAddress");
        console.log(orders);
        res.status(200).json(orders);
    } catch (err) {
        console.error("getOrdersByUser error:", err);
        res.status(500).json({ message: "Failed to fetch user orders" });
    }
}

module.exports = {
    getOrdersByUser,
};
