const express = require("express");
const { isAuthenticated } = require("../../middleware/auth.middleware");
const {
    addAddress,
    getAddresses,
    setDefaultAddress,
    deleteAddress,
    updateAddress,
} = require("../../controller/user/adress.controller");

const addressRouter = express.Router();
addressRouter.post("/add", addAddress);
addressRouter.get("/getAll", getAddresses);
addressRouter.put("/default/:id", setDefaultAddress);
addressRouter.delete("/:id", deleteAddress);
addressRouter.put("/:id", updateAddress);
module.exports = addressRouter;
