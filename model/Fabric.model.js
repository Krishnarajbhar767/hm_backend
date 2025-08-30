// models/Fabric.model.js
const mongoose = require("mongoose");

const fabricSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
});

const Fabric = mongoose.model("Fabric", fabricSchema);
module.exports = Fabric; //
