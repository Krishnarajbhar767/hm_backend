const cloudinary = require("cloudinary").v2;

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            //! ########   Configuring the Cloudinary to Upload MEDIA ########
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    } catch (error) {
        console.log("Error While Connecting To The Cloudinary Server");
    }
};

module.exports = connectCloudinary;
