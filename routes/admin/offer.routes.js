// const express = require("express");
// const {
//     createOffer,
//     updateOffer,
//     adminGetOffer,
// } = require("../../controller/admin/offer.controller");

// const adminOfferRouter = express.Router();
// adminOfferRouter.post("/create", createOffer);
// adminOfferRouter.put("/update", updateOffer);
// adminOfferRouter.get("/", adminGetOffer);

// module.exports = adminOfferRouter;


const express = require("express");
const {
    createOffer,
    updateOffer,
    adminGetOffer,
    deleteOffer,
} = require("../../controller/admin/offer.controller");

const adminOfferRouter = express.Router();
adminOfferRouter.post("/create", createOffer);
adminOfferRouter.put("/update/:id", updateOffer);
adminOfferRouter.delete("/delete/:id", deleteOffer);
adminOfferRouter.get("/", adminGetOffer);

module.exports = adminOfferRouter;
