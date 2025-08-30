// middleware/notFound.middleware.js

const notFound = (req, res) => {
    res.error(`Route not found: ${req.originalUrl}`, 404);
};

module.exports = notFound;
