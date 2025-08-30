const Product = require("../../../model/Product.model");
const { client } = require('../../../utils/redisClient');

const asyncHandler = require("express-async-handler");


const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({})
        .populate("category")
        .populate("fabric")
        .populate({
            path: "reviews",
            populate: {
                path: "user",
                model: "User",
            },
        })
        .exec();
    return res.success("Products Fetched Successfully.", products);
});

const getProductById = asyncHandler(async (req, res) => {
    const _id = req.body?.id || req.params.id;
    if (!_id) {
        return res.error("Products Id Are Required", 400);
    }
    const product = await Product.findById(_id)
        .populate("category")
        .populate("fabric")
        .populate({
            path: "reviews",
            populate: {
                path: "user",
                model: "User",
            },
        });
    if (!product) {
        return res.error("Product Not Found", 404);
    }
    return res.success("Product Fetched Successfully", product);
});

const getProductByfabric = async (req, res) => {
    try {
        console.log(req.params);
        const { fabric, id } = req.params;
        const title = fabric.replace(/-/g, " ");
        if (!title) {
            return res
                .status(400)
                .json({ success: false, message: "Fabric title is required" });
        }

        const products = await Product.find().populate("fabric").lean();

        const filteredProducts = products.filter(
            (product) =>
                product.fabric?.title?.toLowerCase() === title.toLowerCase()
        );

        res.json({
            success: true,
            data: filteredProducts,
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
module.exports = { getAllProducts, getProductById, getProductByfabric };
