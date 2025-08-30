const express = require("express");
const fabricRouter = express.Router();
const Fabric = require("../../model/Fabric.model");
const Product = require("../../model/Product.model");
// GET all fabrics
fabricRouter.get("/", async (req, res) => {
    try {
        const fabrics = await Fabric.find();
        return res.status(200).json(fabrics);
    } catch (err) {
        console.error("Error fetching fabrics:", err);
        return res.error("Failed to fetch fabrics");
    }
});

// POST add new fabric
fabricRouter.post("/", async (req, res) => {
    try {
        const { title } = req.body;
        console.log("TItle Of Fabric ->", title);
        if (!title || !title.trim()) {
            return res.error("Title is required", 400);
        }

        const existing = await Fabric.findOne({
            title: title.toLowerCase().trim(),
        });
        if (existing) {
            return res.error("Fabric already exists!", 409);
        }

        const newFabric = await Fabric.create({ title });

        const allFabrics = await Fabric.find();
        return res.status(201).json(allFabrics);
    } catch (err) {
        console.error("Error adding fabric:", err);
        return res.error("Failed to add fabric", 500);
    }
});

// PUT update fabric
fabricRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.error("Title is required", 400);
        }

        const existing = await Fabric.findOne({
            title: title.toLowerCase().trim(),
            _id: { $ne: id },
        });

        if (existing) {
            return res.error("Fabric with this title already exists", 409);
        }

        await Fabric.findByIdAndUpdate(id, {
            title: title.toLowerCase().trim(),
        });
        const allFabrics = await Fabric.find();
        return res.status(200).json(allFabrics);
    } catch (err) {
        console.error("Error updating fabric:", err);
        return res.error("Failed to update fabric", 500);
    }
});

// DELETE fabric
fabricRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Fabric.findByIdAndDelete(id);
        const allFabrics = await Fabric.find();
        return res.status(200).json(allFabrics);
    } catch (err) {
        console.error("Error deleting fabric:", err);
        return res.error("Failed to delete fabric", 500);
    }
});

module.exports = fabricRouter;
