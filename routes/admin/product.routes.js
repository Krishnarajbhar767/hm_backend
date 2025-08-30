const express = require("express");
const productRouter = express.Router();
const {
    isAuthenticated,
    isAdmin,
} = require("../../middleware/auth.middleware");
const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require("../../controller/admin/product.controller");
productRouter.post("/create", createProduct);
productRouter.put("/update/:id", updateProduct);

module.exports = productRouter;
