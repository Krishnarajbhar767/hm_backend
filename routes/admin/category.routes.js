const {
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../../controller/admin/category.controller");

const categoryRouter = require("express").Router();
categoryRouter.post("/create", createCategory);
categoryRouter.put("/update/:id", updateCategory);
categoryRouter.delete("/delete/:id", deleteCategory);
module.exports = categoryRouter;
