const express = require("express");
const authRoutes = require("../routes/auth.routes");
const adminRoutes = require("../routes/admin/index.routes");
const {
    getAllProducts,
    getProductById,
    getProductByfabric,
} = require("../controller/public/product/product.controller");
const {
    getAllCategories,
    getCategoryById,
} = require("../controller/public/product/category.controller");


const imageUploader = require("../utils/imageUpload.utils");

const userRoutes = require("./user/index.routes");
const paymentRoutes = require("./payment.routes");
const mailSender = require("../utils/mailSender.utils");
const bookVideoCallTemplate = require("../email/template/bookVideoCallTemplate");
const bookVideoCallAdminTemplate = require("../email/template/bookVideoCallAdminTemplate");
const Newsletter = require("../model/Newsletter.model");
const contactEmailTemplate = require("../email/template/contactEmailTemplate");
const {
    getOffer,
    getOfferOfProduct,
} = require("../controller/public/product/offer.controller");
const adminCustomRugNotificationTemplate = require("../email/template/adminCustomRugNotificationTemplate");


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/payment", paymentRoutes);
// Public routes
// Products
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/products/:fabric/:id", getProductByfabric);
// Categories
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.get("/offer", getOffer);
router.get("/offer/:productId", getOfferOfProduct);

router.post("/upload", async (req, res) => {
    try {
        const images = req.files?.files ?? null;
        const imageFileName = req.body.name;

        if (!images) {
            return res
                .status(400)
                .json({ success: false, message: "Please upload file first" });
        }

        const imageList = Array.isArray(images) ? images : [images];

        for (const image of imageList) {
            if (image.size > 100 * 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    message: "Image should not be larger than 100MB",
                });
            }
        }

        const slugFIleName = imageFileName.trim().replace(/\s+/g, "-");
        const result = await imageUploader(images, slugFIleName); // now uploads to local folder
        return res.status(200).json({
            success: true,
            message: "Images uploaded successfully",
            data: result,
        });
    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
});



router.post("/bookVideoCall", async (req, res) => {
    const { email, body } = req.body;

    if (!body) {
        // Use res.status() and res.json() for error responses
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    try {
        const usertemplate = bookVideoCallTemplate(
            body?.fullName,
            body?.date,
            body?.time
        );
        const admintemplate = bookVideoCallAdminTemplate(
            body?.fullName,
            body?.email,
            body?.phone,
            body?.date,
            body?.time,
            "None"
        );

        // Renamed 'res' variable to avoid conflict with the Express 'res' object
        const userMailResponse = await mailSender(
            email,
            "Video Call Book, Confirmation",
            usertemplate
        ); // send to user

        const adminMailResponse = await mailSender(
            "himalayacarpetsindia@gmail.com",
            "New Video Call Book",
            admintemplate
        ); // send to Admin

        // Use res.status() and res.json() for success responses
        return res.status(200).json({
            success: true,
            message: "Video Call Booked Successfully",
            data: { userMailResponse, adminMailResponse },
        });
    } catch (error) {
        console.log(error);
        // Use res.status() and res.json() for error responses
        return res.status(500).json({
            success: false,
            message: "Failed to book video call",
        });
    }
});

router.post("/newsletter", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.error("Please enter a valid email address", 400);
    }

    try {
        const exists = await Newsletter.findOne({ email });

        if (exists) {
            return res.error(
                "You are already subscribed to the newsletter.",
                409
            );
        }

        await Newsletter.create({ email });

        return res.success("Successfully subscribed to the newsletter!");
    } catch (err) {
        console.error("Newsletter Error:", err);
        return res.error("Something went wrong. Please try again later.", 500);
    }
});

// POST /api/contact
router.post("/contact", async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const htmlBody = contactEmailTemplate({
            name,
            email,
            phone,
            subject,
            message,
        });

        // Send mail to admin
        await mailSender(
            "himalayacarpetsindia@gmail.com",
            `Contact Us: ${subject}`,
            htmlBody
        );

        //  send a confirmation to user
        const userBody = `
      Hi ${name},<br/><br/>
      Thanks for reaching out! We've received your message and will get back to you shortly.<br/><br/>
      Regards,<br/>Himalaya Carpets Team
    `;
        await mailSender(email, "We received your message!", userBody);

        return res.json({
            success: true,
            message: "Message sent successfully.",
        });
    } catch (err) {
        console.error("Contact POST error:", err);
        return res.status(500).json({ error: "Failed to send message." });
    }
});

router.post("/custom-rug-request", async (req, res) => {
    // Destructure all expected fields from the form data
    const {
        name,
        email,
        phone,
        sizePreference,
        customWidth,
        customLength,
        material, // This will be an array of selected materials
        colorPalette,
        shape,
        designStyle,
        designDescription,
    } = req.body;

    // --- Basic Validation ---
    // Validate required fields that were set in MakeYourOwnRugsPage
    if (!name || !email || !sizePreference || !colorPalette || !designStyle || !designDescription || !shape) {
        return res.status(400).json({ error: "Missing required client or customization fields." });
    }

    // Validate material array is not empty
    if (!material || material.length === 0) {
        return res.status(400).json({ error: "Please select at least one material preference." });
    }

    // Conditional validation for custom dimensions
    if (sizePreference === 'custom') {
        if (!customWidth || !customLength) {
            return res.status(400).json({ error: "Custom width and length are required for custom size preference." });
        }
    }

    try {
        // --- Send mail to Admin ---
        const adminHtmlBody = adminCustomRugNotificationTemplate({
            name,
            email,
            phone,
            sizePreference,
            customWidth,
            customLength,
            material,
            colorPalette,
            designStyle,
            designDescription,
            shape,
        });

        await mailSender(
            "himalayacarpetsindia@gmail.com", // Admin's email address
            `New Custom Rug Request from ${name}`,
            adminHtmlBody
        );

        // --- Send a confirmation to the User ---
        const userConfirmationBody = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Custom Rug Request Confirmation</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    h2 { color: #850E4B; font-size: 24px; margin-bottom: 20px; text-align: center; }
                    p { color: #333; line-height: 1.6; margin-bottom: 15px; }
                    strong { color: #850E4B; }
                    .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Thank You For Your Custom Rug Request!</h2>
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>We've successfully received your custom rug design request. Our team is excited to review your ideas and will get back to you shortly to discuss the next steps.</p>
                    <p>We appreciate your patience as we meticulously craft bespoke solutions tailored just for you.</p>
                    <p>Regards,<br/>The Himalaya Carpets Team</p>
                    <div class="footer">
                        This is an automated message from Himalaya Carpets.
                    </div>
                </div>
            </body>
            </html>
        `;
        await mailSender(
            email, // User's email address
            "Himalaya Carpets: Your Custom Rug Request Confirmation",
            userConfirmationBody
        );

        return res.json({
            success: true,
            message: "Custom rug request submitted successfully. We've sent a confirmation email.",
        });
    } catch (err) {
        console.error("Custom Rug Request API Error:", err);
        return res.status(500).json({ error: "Failed to submit custom rug request. Please try again." });
    }
});

module.exports = router;
