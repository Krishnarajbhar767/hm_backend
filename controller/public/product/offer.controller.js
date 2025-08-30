// const Offer = require("../../../model/Offer.model");

// const getOffer = async (req, res) => {
//     try {
//         const offer = await Offer.findOne();

//         if (
//             !offer ||
//             !offer.status ||
//             offer.isExpired ||
//             offer.usageCount >= offer.maxUsageLimit
//         ) {
//             return res.error("No active offer found.", 404);
//         }

//         return res.status(200).json(offer);
//     } catch (error) {
//         console.error("Error fetching offer:", error);
//         return res.error("Something went wrong while fetching the offer.", 500);
//     }
// };

// module.exports = {
//     getOffer,
// };



/// New 2 Aug

const Offer = require("../../../model/Offer.model");
const Product = require("../../../model/Product.model");

/**
 * Utility to check if an offer is expired or not usable
 */
const isOfferActive = (offer) => {
    const createdAt = new Date(offer.createdAt).getTime();
    const expiry = createdAt + offer.maxAge * 60 * 60 * 1000;
    return (
        offer.status &&
        Date.now() < expiry &&
        offer.usageCount < offer.maxUsageLimit
    );
};

const getOffer = async (req, res) => {
    try {
        const offers = await Offer.find();
        const activeOffers = offers.filter(isOfferActive);

        if (!activeOffers.length) {
            return res.error("No active offer found.", 404);
        }

        return res.status(200).json(activeOffers);
    } catch (error) {
        console.error("Error fetching offer:", error);
        return res.error("Something went wrong while fetching the offer.", 500);
    }
};

const getOfferOfProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.error("Product Not found", 400);

        const offer = await Offer.findOne({ discount: product.offerDiscount });

        if (!offer || !isOfferActive(offer)) {
            return res.error("No active offer found.", 404);
        }

        return res.status(200).json(offer);
    } catch (error) {
        console.error("Error fetching offer:", error);
        return res.error("Something went wrong while fetching the offer.", 500);
    }
};

module.exports = {
    getOffer,
    getOfferOfProduct,
};
//  Public -> Offer.controller
