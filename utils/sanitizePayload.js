/**
 * Filters and sanitizes the request payload based on allowed fields.
 * Removes keys not in the whitelist and any invalid values (null, "", undefined).
 *
 * @param {Object} payload - The request body (or any object)
 * @param {Array} allowedFields - List of allowed keys (case-sensitive)
 * @returns {Object} - Sanitized payload
 */
const sanitizePayload = (payload = {}, allowedFields = []) => {
    return Object.fromEntries(
        // Convert Object TO  [[key,value],[key,value]]
        Object.entries(payload).filter(
            // [key,value] Extracting
            ([key, value]) =>
                allowedFields.includes(key) &&
                value !== undefined &&
                value !== null &&
                value !== ""
        )
    );
};

module.exports = sanitizePayload;
