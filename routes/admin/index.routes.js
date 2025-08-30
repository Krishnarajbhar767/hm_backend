const express = require("express");
const adminRouter = express.Router();
const productRoutes = require("../../routes/admin/product.routes");
const categoryRoutes = require("../../routes/admin/category.routes");
const {
    isAuthenticated,
    isAdmin,
} = require("../../middleware/auth.middleware");

const userRouter = require("./user.routes");
const { getOverview } = require("../../controller/admin/overview.controller");
const orderRouter = require("./order.routes");
const fabricRouter = require("./fabric.routes");
const couponRouter = require("./coupon.routes");
const adminOfferRouter = require("./offer.routes");

// Not Want  ot inlcude Fabric ->
adminRouter.use("/fabrics", fabricRouter);
// Private Routes For Admin
adminRouter.use(isAuthenticated, isAdmin);
adminRouter.use("/product", productRoutes);
adminRouter.use("/category", categoryRoutes);
adminRouter.use("/user", userRouter);
adminRouter.use("/orders", orderRouter);
adminRouter.use("/coupon", couponRouter);
adminRouter.use("/offer", adminOfferRouter);
adminRouter.get("/overview", getOverview);
adminRouter.get('/newsletters',async(req,res)=>{
    try {
        const emails = await NewsletterModel.find({});
        return res.status(200).json(emails)
    } catch (error) {
       return  res.status(500).json({
            message:"Error wile fetching  emails"
        })
    }
})

module.exports = adminRouter;
