// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//     {
//         razorpay_order_id: {
//             type: String,
//             required: true,
//         },
//         delhiveryReceipt: {
//             type: String,
//         },
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         items: [
//             {
//                 product: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     ref: "Product",
//                 },
//                 withFallPico: {
//                     type: Boolean,
//                     required: true,
//                 },
//                 withTassels: {
//                     type: Boolean,
//                     required: true,
//                 },
//                 quantity: { type: Number, default: 1 },
//             },
//         ],
//         shippingAddress: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Address",
//         },
//         discount: {
//             type: Number,
//         },
//         offer: {
//             type: Number,
//         },
//         shippingAddressSnapshot: {
//             street: String,
//             city: String,
//             state: String,
//             zip: String,
//             country: String,
//             phone: String,
//         },
//         paymentMethod: {
//             type: String,
//         },
//         paymentStatus: {
//             type: String,
//             enum: ["Pending", "Paid", "Failed"],
//             default: "Pending",
//         },
//         paidAt: {
//             type: Date,
//         },
//         isDelivered: {
//             type: Boolean,
//             default: false,
//         },
//         deliveredAt: {
//             type: Date,
//         },
//         deliveryStatus: {
//             type: String,
//             enum: [
//                 "Pending",
//                 "Shipped",
//                 "Out for Delivery",
//                 "Delivered",
//                 "Canceled",
//             ],
//             default: "Pending",
//         },
//         totalAmount: Number,
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);



///  2 Aug 

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        razorpay_order_id: {
            type: String,
            required: true,
        },
        delhiveryReceipt: {
            type: String,
        },
        trackingId: {
            type: String,
        },
        parcelWeight: {
            type: Number,
        },
        deliveryPartner: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                withFallPico: {
                    type: Boolean,
                    required: true,
                },
                withTassels: {
                    type: Boolean,
                    required: true,
                },
                quantity: { type: Number, default: 1 },
                offer: {
                    type: Number,
                },
            },
        ],
        shippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },
        discount: {
            type: Number,
        },
        // offer: {
        //     type: Number,
        // },
        shippingAddressSnapshot: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
            phone: String,
        },
        paymentMethod: {
            type: String,
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        deliveryStatus: {
            type: String,
            enum: [
                "Pending",
                "Shipped",
                "Out for Delivery",
                "Delivered",
                "Canceled",
            ],
            default: "Pending",
        },
        totalAmount: Number,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);