const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const dotenv = require("dotenv");
const ratelimit = require("./middleware/rateLimit.middleware");
const notFound = require("./middleware/notFound.middleware");
const sendCustomResponse = require("./middleware/customResponse.middleware");
const connectDB = require("./config/connectDb");
const { globalErrorHandler } = require("./middleware/globalErrorHandler.middleware");
const router = require("./routes/index.routes");

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middlewares
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


// Serve static files from /root/uploads/image/products
app.use("/images/products", express.static("/root/uploads/image/products"));

// Serve images from /root/uploads/image at /images URL
// app.use("/images", express.static("/root/uploads/image"));

// CORS settings
const allowedOrigins = ["http://localhost:5174","http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Security headers
app.use(helmet());

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Custom response handler
app.use(sendCustomResponse);

// API routes
app.use("/api/v1", router);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the API root SRIJNFBS..../1");
});





// 404 handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 5679;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
