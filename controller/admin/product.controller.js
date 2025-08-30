const asyncHandler = require("express-async-handler");
const imageUplaoder = require("../../utils/imageUpload.utils");
const Product = require("../../model/Product.model");
const Category = require("../../model/Category.model");
const sanitizePayload = require("../../utils/sanitizePayload");
const { PRODUCT_ALLOWED_FIELDS } = require("../../constants/constants");

const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        category,
        stock,
        fabric,
        technique,
        color,
        weight,
        assurance,
        hsnCode,
        reviews = [],
        images = [],
    } = req.body;

    // Validate required fields
    if (
        !name ||
        !description ||
        !price ||
        !category ||
        !stock ||
        !fabric ||
        !technique ||
        !color ||
        !weight ||
        !assurance ||
        !hsnCode ||
        !images
    ) {
        return res.error("All required fields must be filled properly.", 400);
    }

    // Check if category exists
    const targetCategory = await Category.findById(category);
    if (!targetCategory) {
        return res.error("Provided category does not exist", 404);
    }

    const productPayload = {
        name,
        description,
        price,
        category,
        stock,
        fabric,
        technique,
        color,
        weight,
        assurance,
        hsnCode,
        reviews,
        images,
    };

    // Create product
    const product = await Product.create(productPayload);

    // Add to 'all' category
    await Category.findOneAndUpdate(
        { name: "all" },
        { $addToSet: { products: product._id } }
    );

    // Add to specified category
    await Category.findByIdAndUpdate(category, {
        $addToSet: { products: product._id },
    });
    const allProducts = await Product.find({})
        .sort({ createdAt: -1 })
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

    return res.success("Product created successfully.", allProducts);
});

const updateProduct = asyncHandler(async (req, res) => {
    const _id = req.params?.id || req.body?.id;
    const payload = req.body;

    if (!_id) return res.error("Product ID is required", 400);
    if (!payload || Object.keys(payload).length === 0)
        return res.error("No fields provided to update", 400);

    const product = await Product.findById(_id);
    if (!product) return res.error("Product not found", 404);

    const oldCategoryId = product.category?.toString();
    const newCategoryId = payload.category?.toString();

    const sanitizedPayload = sanitizePayload(payload, PRODUCT_ALLOWED_FIELDS);
    if (Object.keys(sanitizedPayload).length === 0)
        return res.error("No valid fields to update", 400);

    // Update product (category is part of payload)
    const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        sanitizedPayload,
        {
            new: true,
            runValidators: true,
        }
    );

    // If category changed, update references
    if (newCategoryId && newCategoryId !== oldCategoryId) {
        // Remove product from old category
        if (oldCategoryId) {
            await Category.findByIdAndUpdate(oldCategoryId, {
                $pull: { products: _id },
            });
        }

        // Add product to new category
        await Category.findByIdAndUpdate(newCategoryId, {
            $addToSet: { products: _id },
        });
    }

    const allProducts = await Product.find({})
        .sort({ createdAt: -1 })
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
    return res.success("Product category updated successfully", allProducts);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const _id = req.body?.id || req.params.id;
    if (!_id) {
        return res.error("Product ID is required", 400);
    }

    // Find the product first to get its category
    const product = await Product.findById(_id);
    if (!product) {
        return res.error("Product not found", 404);
    }

    // Delete the product
    const deletedProduct = await Product.findByIdAndDelete(_id);

    // Remove product from the 'all' category
    await Category.findOneAndUpdate(
        { name: "all" },
        { $pull: { products: _id } }
    );

    // Remove product from its original category
    await Category.findByIdAndUpdate(product.category, {
        $pull: { products: _id },
    });

    const allProducts = await Product.find({})
        .sort({ createdAt: -1 })
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
    return res.success("Product deleted successfully", allProducts);
});

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
};