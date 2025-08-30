module.exports = function userOrderConfirmationTemplate(order, user) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border:1px solid #ddd; padding: 24px; background-color: #fff;">
        <h2 style="color: #222;">Hi ${user.firstName
        }, your order is confirmed! 🎉</h2>
        <p style="margin-bottom: 20px;">Thank you for shopping with <strong>Himalaya Carpets</strong>. Here’s your order summary:</p>

        <h3 style="color: #333;">📍 Shipping To</h3>
        <p style="margin: 8px 0;">
            ${order.shippingAddressSnapshot.street},<br/>
            ${order.shippingAddressSnapshot.city}, ${order.shippingAddressSnapshot.state
        }<br/>
            ${order.shippingAddressSnapshot.postalCode}, ${order.shippingAddressSnapshot.country
        }<br/>
            📞 ${order.shippingAddressSnapshot.phone}
        </p>

        <h3 style="color: #333; margin-top: 30px;">🛍 Items Ordered</h3>
        <ul style="padding-left: 0; list-style: none;">
            ${order.items
            .map(
                (item) => `
                    <li style="margin-bottom: 20px; display: flex; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 12px;">
                        <img src="${item.product.images[0]}" alt="${item.product.name
                    }" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 16px;" />
                        <div>
                            <a href="https://himalayacarpetsindia.com/product/${item.product._id
                    }" target="_blank" style="font-weight: bold; color: #333; text-decoration: none;">${item.product.name
                    }</a><br/>
                            Qty: ${item.quantity}, Fall/Pico: ${item.withFallPico ? "Yes" : "No"
                    }, Tassels: ${item.withTassels ? "Yes" : "No"}, Offer: ${item.offer || 0
                    }%<br/>
                            Price: ₹${item.product.price}
                        </div>
                    </li>
                `
            )
            .join("")}
        </ul>

        <h3 style="color: #333;">💳 Payment Details</h3>
        <p>Status: <strong>${order.paymentStatus}</strong></p>
        <p>Method: <strong>${order.paymentMethod}</strong></p>
        <p>Total Paid: <strong>₹${order.totalAmount}</strong></p>

        <hr style="margin: 30px 0;" />
        <p style="font-size: 13px; color: #777;">
            We’ll notify you once your order is shipped. For help, contact our team anytime.<br/>
            <strong>Himalaya Carpets</strong>
        </p>
    </div>
    `;
};
