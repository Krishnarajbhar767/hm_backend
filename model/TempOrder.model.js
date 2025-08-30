// const mongoose = require("mongoose");

// const tempOrderSchema = new mongoose.Schema(
//     {
//         razorpay_order_id: {
//             type: String,
//             required: true,
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
//                     required: true,
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

//         //  TTL field
//         createdAt: {
//             type: Date,
//             default: Date.now,
//             expires: 300, // auto-delete after 5 minutes (300 seconds)
//         },
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("TempOrder", tempOrderSchema);




//2 Aug Code 

const mongoose = require("mongoose");

const tempOrderSchema = new mongoose.Schema(
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
                    required: true,
                },
                withFallPico: {
                    type: Boolean,
                    required: true,
                },
                withTassels: {
                    type: Boolean,
                    required: true,
                },
                offer: {
                    type: Number,
                },
                quantity: { type: Number, default: 1 },
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

        //  TTL field
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300, // auto-delete after 5 minutes (300 seconds)
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("TempOrder", tempOrderSchema);
