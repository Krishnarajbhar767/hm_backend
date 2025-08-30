// const asyncHandler = require("express-async-handler");
// const Category = require("../../model/Category.model");
// const sanitizePayload = require("../../utils/sanitizePayload");
// const { CATEGORY_ALLOWED_FIELDS } = require("../../constants/constants");

// const createCategory = asyncHandler(async (req, res) => {
    
//     // get data from body;
//     const { name, description } = req.body;

//     // Validate data;
//     if (!name || !description) return res.error("All fields are required", 400);
//     // create New Category;
//     const newCategory = await Category.create({ name, description });
//     const allUpdatedCategories = await Category.find({});
//     return res.success("Category Created Successfully", allUpdatedCategories);
// });

// const updateCategory = asyncHandler(async (req, res) => {
//     const _id = req.params?.id || req.body?.id;
//     if (Object.keys(req.body).length === 0) {
//         return res.error("Please provide at least one field to update", 400);
//     }

//     const sanitizedPayload = sanitizePayload(req.body, CATEGORY_ALLOWED_FIELDS);
//     if (Object.keys(sanitizedPayload).length == 0) {
//         return res.error("Your input values are either invalid or empty.", 404);
//     }

//     const updatedCategory = await Category.findByIdAndUpdate(
//         _id,
//         sanitizedPayload,
//         {
//             new: true,
//             runValidators: true,
//         }
//     );
//     if (!updatedCategory) {
//         return res.error("Category not found or update failed.", 404);
//     }
//     const allUpdatedCategories = await Category.find({});
//     return res.success("Category Updated Successfully", allUpdatedCategories);
// });
// const deleteCategory = asyncHandler(async (req, res) => {
//     const _id = req.params?.id || req.body?.id;
//     if (!_id) {
//         return res.error("category id is required", 404);
//     }

//     const categoryDetails = await Category.findByIdAndDelete(_id);
//     if (!categoryDetails) {
//         return res.error("Category Not Found", 404);
//     }
//     return res.success("Category Deleted Successfully");
// });

// module.exports = {
//     createCategory,
//     updateCategory,
//     deleteCategory,
// };


/// 4 Aug 


const asyncHandler = require("express-async-handler");
const Category = require("../../model/Category.model");
const Product = require("../../model/Product.model");
const sanitizePayload = require("../../utils/sanitizePayload");
const { CATEGORY_ALLOWED_FIELDS } = require("../../constants/constants");

// Ensure 'all' category exists before any operation
const ensureAllCategoryExists = async () => {
    await Category.updateOne(
        { name: "all" },
        {
            $setOnInsert: {
                name: "all",
                description: "All Products",
                products: [],
            },
        },
        { upsert: true }
    );
};

const createCategory = asyncHandler(async (req, res) => {
    await ensureAllCategoryExists();

    const { name, description } = req.body;
    if (!name || !description) {
        return res.error("All fields are required", 400);
    }

    const isDuplicate = await Category.findOne({
        name: name.trim().toLowerCase(),
    });
    if (isDuplicate) {
        return res.error("Category with this name already exists.", 409);
    }

    const newCategory = await Category.create({
        name: name.trim().toLowerCase(),
        description,
    });
    const allUpdatedCategories = await Category.find({});
    return res.success("Category Created Successfully", allUpdatedCategories);
});

const updateCategory = asyncHandler(async (req, res) => {
    const _id = req.params?.id || req.body?.id;
    if (!_id) {
        return res.error("Category ID is required", 400);
    }

    if (Object.keys(req.body).length === 0) {
        return res.error("Please provide at least one field to update", 400);
    }

    const sanitizedPayload = sanitizePayload(req.body, CATEGORY_ALLOWED_FIELDS);
    if (Object.keys(sanitizedPayload).length == 0) {
        return res.error("Your input values are either invalid or empty.", 404);
    }

    const existingCategory = await Category.findById(_id);
    if (!existingCategory) {
        return res.error("Category not found", 404);
    }

    let updatedCategory;

    if (existingCategory.name === "all") {
        // Prevent name change for "all"
        delete sanitizedPayload.name;
    }
    updatedCategory = await Category.findByIdAndUpdate(_id, sanitizedPayload, {
        new: true,
        runValidators: true,
    });

    const allUpdatedCategories = await Category.find({});
    return res.success("Category Updated Successfully", allUpdatedCategories);
});

const deleteCategory = asyncHandler(async (req, res) => {
    await ensureAllCategoryExists();

    const _id = req.params?.id || req.body?.id;
    if (!_id) {
        return res.error("Category ID is required", 400);
    }

    const categoryToDelete = await Category.findById(_id);
    if (!categoryToDelete) {
        return res.error("Category Not Found", 404);
    }

    if (categoryToDelete.name === "all") {
        return res.error("Cannot delete the 'all' category", 403);
    }

    const productIds = categoryToDelete.products || [];

    if (productIds.length > 0) {
        // Step 1: Get the 'all' category
        const allCategory = await Category.findOne({ name: "all" });

        // Step 2: Update all affected products to point to 'all' category
        await Product.updateMany(
            { _id: { $in: productIds } },
            { category: allCategory._id }
        );

        // Step 3: Add these products to 'all' category without duplicates
        await Category.updateOne(
            { _id: allCategory._id },
            { $addToSet: { products: { $each: productIds } } }
        );
    }

    // Step 4: Delete the category
    await Category.findByIdAndDelete(_id);
    const allCat = await Category.find({});
    return res.success(
        Category ` deleted successfully. Products moved to 'all'.`,
        allCat
    );
});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
};