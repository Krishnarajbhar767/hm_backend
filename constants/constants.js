// Define allowed fields for product updates (strict & safe)
const PRODUCT_ALLOWED_FIELDS = [
    "name",
    "description",
    "price",
    "psft", // price per square foot
    "category",
    "stock",
    "images",
    "material",
    "weaving",
    "texture",
    "pileThickness",
    "size",
    "color",
    "weight",
    "assurance",
    "hsnCode",
    "style",
    "isOfferAplied",
    "offerDiscount"
];

const CATEGORY_ALLOWED_FIELDS = ["name", "description", "image"];

module.exports = {
    PRODUCT_ALLOWED_FIELDS,
    CATEGORY_ALLOWED_FIELDS,
};
