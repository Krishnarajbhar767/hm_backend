// middleware/errorHandler.js
exports.globalErrorHandler = (err, req, res, next) => {
    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({
            success: false,
            message: errors[0],
            errors,
        });
    }

    // Mongoose Duplicate Key Error (e.g. unique email)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${
                field.charAt(0).toUpperCase() + field.slice(1)
            } already exists`,
        });
    }

    // Cast Error (e.g. invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`,
        });
    }

    // Default to 500 Server Error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server Error",
        err,
    });
};
