// const razorpayInstance = require("../utils/razorpayInstance");

// const Payment = require("./../model/Payment.model");
// const crypto = require("crypto");
// const Order = require("../model/Order.model");
// const Product = require("../model/Product.model");
// const Address = require("../model/Adress.model");
// const TempOrder = require("../model/TempOrder.model");
// const User = require("../model/User.model");
// exports.checkoutHandler = async (req, res) => {
//     try {
//         const {
//             amount,
//             userId,
//             items,
//             addressId,
//             discount = 0,
//             offer = 0,
//         } = req.body;

//         if (!amount || !userId || !items || !addressId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing required fields",
//             });
//         }

//         // 1. Create Razorpay order
//         const razorpayOrder = await razorpayInstance.orders.create({
//             amount: amount * 100,
//             currency: "INR",
//         });

//         // Optimised Items FOr Mongdb Schema
//         console.log("Payment checkout Order Itemsssss", items);
//         const orderItems = items.map((item) => {
//             return {
//                 product: item.id,
//                 quantity: item?.quantity,
//                 withFallPico: item.addons.withFallPico,
//                 withTassels: item.addons.withTassels,
//                 isOfferAplied: items.isOfferAplied,
//             };
//         });
//         console.log("Payment checkout order items", orderItems);
//         // 2. Save order in MongoDB

//         const tempOrder = await TempOrder.create({
//             razorpay_order_id: razorpayOrder.id,
//             user: userId,
//             items: orderItems,
//             shippingAddress: addressId,
//             totalAmount: amount,
//             discount,
//             offer,
//         });
//         return res.status(200).json(razorpayOrder);
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong while creating the order",
//             error: error.message,
//         });
//     }
// };

// exports.paymentVerificationHandler = async (req, res) => {
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
//         req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     try {
//         const expectedSignature = crypto
//             .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
//             .update(body)
//             .digest("hex");

//         const isAuthentic = razorpay_signature === expectedSignature;

//         if (!isAuthentic) {
//             return res.redirect(
//                 `${process.env.FRONTEND_URL}/paymentFailed?reason=Invalid signature`
//             );
//         }

//         // 1. Find the related temp order
//         const tempOrder = await TempOrder.findOne({ razorpay_order_id });

//         if (!tempOrder) {
//             return res.redirect(
//                 `${process.env.FRONTEND_URL}/paymentFailed?reason=Order not found`
//             );
//         }

//         // 2. Create real order from temp order
//         const tempData = tempOrder.toObject(); // convert to plain JS object
//         delete tempData._id;
//         delete tempData.createdAt;
//         delete tempData.updatedAt;
//         // Getting this data for decrease Stock Of Product
//         const orderedItems = tempData?.items?.map((item) => ({
//             _id: item.product,
//             quantity: item.quantity,
//         }));

//         const paymentDetails = await razorpayInstance.payments.fetch(
//             razorpay_payment_id
//         );
//         const address = await Address.findById(tempOrder.shippingAddress);
//         const paymentMethod = paymentDetails.method; // e.g. "upi", "card", "wallet"

//         const finalOrder = await Order.create({
//             ...tempData,
//             paymentMethod,
//             paymentStatus: "Paid",
//             paidAt: new Date(),
//             shippingAddressSnapshot: {
//                 street: address.street,
//                 city: address.city,
//                 state: address.state,
//                 postalCode: address.postalCode,
//                 country: address.country,
//                 phone: address.phone,
//             },
//         });

//         // 3. Create payment record
//         await Payment.create({
//             razorpay_payment_id,
//             razorpay_order_id,
//             razorpay_signature,
//             user: finalOrder.user,
//             orderId: finalOrder._id,
//         });

//         // 4. Delete temp order
//         await TempOrder.deleteOne({ _id: tempOrder._id });
//         // Minus Ordered quantity In Every Product Stock
//         console.log("Ordered Items ", orderedItems);
//         for (const item of orderedItems) {
//             const product = await Product.findOne({ _id: item._id });

//             let updatedStock = product.stock - item.quantity;
//             if (updatedStock <= 0) {
//                 updatedStock = 0;
//             }
//             await Product.findByIdAndUpdate(item._id, {
//                 stock: updatedStock,
//             });
//         }

//         // Remove  Cart Items From User Carts After Succes  Payment
//         const userId = finalOrder.user;
//         const orderedProductIds = finalOrder.items.map((item) =>
//             item.product.toString()
//         );

//         const user = await User.findById(userId);

//         // Check if any ordered product exists in cart
//         const productsInCart = user.cart.items.filter((cartItem) =>
//             orderedProductIds.includes(cartItem.product.toString())
//         );
//         if (productsInCart.length > 0) {
//             // Remove only the ordered products from cart
//             await User.updateOne(
//                 { _id: userId },
//                 {
//                     $pull: {
//                         "cart.items": {
//                             product: { $in: orderedProductIds },
//                         },
//                     },
//                 }
//             );
//         }
//         // 5. Redirect to success
//         return res.redirect(
//             `${process.env.FRONTEND_URL}/paymentSuccess?reference=${razorpay_payment_id}`
//         );
//     } catch (error) {
//         console.error("Error in payment verification:", error);
//         return res.redirect(
//             `${
//                 process.env.FRONTEND_URL
//             }/paymentFailed?reason=${encodeURIComponent(error.message)}`
//         );
//     }
// };

// exports.updatePaymentStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { paymentStatus } = req.body;

//         // Validate
//         if (!["Pending", "Paid", "Failed"].includes(paymentStatus)) {
//             return res.status(400).json({ message: "Invalid payment status" });
//         }

//         // Find order
//         const order = await Order.findById(id);
//         if (!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         // Update fields
//         order.paymentStatus = paymentStatus;
//         if (paymentStatus === "Paid") {
//             order.paidAt = new Date();
//         } else {
//             // clear paidAt when marking Pending/Failed
//             order.paidAt = null;
//         }

//         // Save & return
//         const updated = await order.save();
//         return res.status(200).json({
//             message: "Payment status updated",
//             data: updated,
//         });
//     } catch (err) {
//         console.error("Error updating payment status:", err);
//         return res.status(500).json({ message: "Server error" });
//     }
// };





/// 2 Aug Code 


const razorpayInstance = require("../utils/razorpayInstance");

const Payment = require("./../model/Payment.model");
const crypto = require("crypto");
const Order = require("../model/Order.model");
const Product = require("../model/Product.model");
const Address = require("../model/Adress.model");
const TempOrder = require("../model/TempOrder.model");
const User = require("../model/User.model");
const mailSender = require("../utils/mailSender.utils");
const adminOrderNotificationTemplate = require("../email/template/adminOrderNotificationTemplate");
const userOrderConfirmationTemplate = require("../email/template/userOrderConfirmationTemplate");


exports.checkoutHandler = async (req, res) => {
    try {
        const { amount, userId, items, addressId, discount = 0 } = req.body;

        if (!amount || !userId || !items || !addressId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        // 1. Create Razorpay order

        const razorpayOrder = await razorpayInstance.orders.create({
            amount: parseInt(amount * 100, 10),
            currency: "INR",
        });

        // Optimised Items FOr Mongdb Schema
        const orderItems = items.map((item) => {
            return {
                product: item.id,
                quantity: item?.quantity,
                withFallPico: item.addons.withFallPico,
                withTassels: item.addons.withTassels,
                isOfferAplied: item.isOfferAplied,
                offer: item.offerDiscount,
            };
        });
        // 2. Save order in MongoDB

        const tempOrder = await TempOrder.create({
            razorpay_order_id: razorpayOrder.id,
            user: userId,
            items: orderItems,
            shippingAddress: addressId,
            totalAmount: amount,
            discount,
        });
        return res.status(200).json(razorpayOrder);
    } catch (error) {
        console.log("Printing Checkout Handler Error ->", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the order",
            error: error.message,
        });
    }
};

exports.paymentVerificationHandler = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    try {
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
            .update(body)
            .digest("hex");

        const isAuthentic = razorpay_signature === expectedSignature;

        if (!isAuthentic) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/paymentFailed?reason=Invalid_signature`
            );
        }

        // 1. Find the related temp order
        const tempOrder = await TempOrder.findOne({ razorpay_order_id });

        if (!tempOrder) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/paymentFailed?reason=Order_not_found`
            );
        }

        // 2. Create real order from temp order
        const tempData = tempOrder.toObject(); // convert to plain JS object
        delete tempData._id;
        delete tempData.createdAt;
        delete tempData.updatedAt;
        // Getting this data for decrease Stock Of Product
        const orderedItems = tempData?.items?.map((item) => ({
            _id: item.product,
            quantity: item.quantity,
        }));

        const paymentDetails = await razorpayInstance.payments.fetch(
            razorpay_payment_id
        );
        const address = await Address.findById(tempOrder.shippingAddress);
        const paymentMethod = paymentDetails.method; // e.g. "upi", "card", "wallet"

        const finalOrder = await Order.create({
            ...tempData,
            paymentMethod,
            paymentStatus: "Paid",
            paidAt: new Date(),
            shippingAddressSnapshot: {
                street: address.street,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
                phone: address.phone,
            },
        });

        // 3. Create payment record
        await Payment.create({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            user: finalOrder.user,
            orderId: finalOrder._id,
        });

        // 4. Delete temp order
        await TempOrder.deleteOne({ _id: tempOrder._id });
        // Minus Ordered quantity In Every Product Stock
        for (const item of orderedItems) {
            const product = await Product.findOne({ _id: item._id });

            let updatedStock = product.stock - item.quantity;
            if (updatedStock <= 0) {
                updatedStock = 0;
            }
            await Product.findByIdAndUpdate(item._id, {
                stock: updatedStock,
            });
        }

        // Remove  Cart Items From User Carts After Succes  Payment
        const userId = finalOrder.user;
        const orderedProductIds = finalOrder.items.map((item) =>
            item.product.toString()
        );

        const user = await User.findById(userId);

        // Check if any ordered product exists in cart
        const productsInCart = user.cart.items.filter((cartItem) =>
            orderedProductIds.includes(cartItem.product.toString())
        );
        if (productsInCart.length > 0) {
            // Remove only the ordered products from cart
            await User.updateOne(
                { _id: userId },
                {
                    $pull: {
                        "cart.items": {
                            product: { $in: orderedProductIds },
                        },
                    },
                }
            );
        }
        // 1. Safely populate order for email only
        const populatedOrder = await Order.findById(finalOrder._id)
            .populate({
                path: "items.product",
                select: "name price images",
            })
            .exec();

        // 2. Send email with populated data
        const htmlBodyAdmin = adminOrderNotificationTemplate(populatedOrder, user);
        const htmlBodyUser = userOrderConfirmationTemplate(
            populatedOrder,
            user
        );

        await mailSender(
            "himalayacarpetsindia@gmail.com",
            "New Order Received",
            htmlBodyAdmin
        );
        await mailSender(
            user.email,
            "Your Order Confirmation - Himalaya Carpets",
            htmlBodyUser
        );
        // 5. Redirect to success

        const successPageUrl = `${process.env.FRONTEND_URL}/paymentSuccess?reference=${razorpay_payment_id}`
        console.log('Redirecting Url ->', successPageUrl)
        return res.redirect(successPageUrl)
    } catch (error) {
        console.error("Error in payment verification:", error);
        return res.redirect(
            `${process.env.FRONTEND_URL
            }/paymentFailed?reason=${encodeURIComponent(error.message)}`
        );
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        // Validate
        if (!["Pending", "Paid", "Failed"].includes(paymentStatus)) {
            return res.status(400).json({ message: "Invalid payment status" });
        }

        // Find order
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update fields
        order.paymentStatus = paymentStatus;
        if (paymentStatus === "Paid") {
            order.paidAt = new Date();
        } else {
            // clear paidAt when marking Pending/Failed
            order.paidAt = null;
        }

        // Save & return
        const updated = await order.save();
        return res.status(200).json({
            message: "Payment status updated",
            data: updated,
        });
    } catch (err) {
        console.error("Error updating payment status:", err);
        return res.status(500).json({ message: "Server error" });
    }
};