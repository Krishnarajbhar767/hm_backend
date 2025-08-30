//
//  * Middleware to attach custom response methods to the res object.
//  * Adds `res.success()` and `res.error()` for consistent API responses.

//  * Usage:
//  *   res.success("Message", data); // for success responses
//  *   res.error("Error message", 400); // for error responses

const sendCustomResponse = (req, res, next) => {
    res.success = (message = "Success", data = {}) => {
        res.status(200).json({
            success: true,
            message,
            data,
        });
    };

    res.error = (message = "Something went wrong", code = 500) => {
        res.status(code).json({
            success: false,
            message,
        });
    };

    next();
};

module.exports = sendCustomResponse;
