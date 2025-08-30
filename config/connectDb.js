require("dotenv").config();
const mongoose = require("mongoose");
const MONGODB_URL = process.env.MONGODB_URL;
// console.log("Mongodb_URL",MONGODB_URL);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error While Connecting Database --->", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
