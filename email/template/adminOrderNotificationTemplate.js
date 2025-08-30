module.exports = function adminOrderNotificationTemplate(order, user) {
    console.log("Order Details ->", order);
    return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border:1px solid #ddd; padding: 24px; background-color: #fff;">
        <h2 style="color: #222;">📢 New Order Received from ${user.firstName} ${user.lastName
        }</h2>
        <p style="margin-bottom: 20px;">You have a new order placed on <strong>Himalaya Carpets</strong>. Below are the order details:</p>

        <h3 style="color: #333;">👤 User Information</h3>
        <p>
            Name: ${user.firstName} ${user.lastName}<br/>
            Email: ${user.email}<br/>
            Phone: ${order.shippingAddressSnapshot.phone}
        </p>

        <h3 style="color: #333;">📍 Shipping Address</h3>
        <p style="margin: 8px 0;">
            ${order.shippingAddressSnapshot.street},<br/>
            ${order.shippingAddressSnapshot.city}, ${order.shippingAddressSnapshot.state
        }<br/>
            ${order.shippingAddressSnapshot.postalCode}, ${order.shippingAddressSnapshot.country
        }<br/>
        </p>

        <h3 style="color: #333; margin-top: 30px;">🛍 Ordered Products</h3>
        <ul style="padding-left: 0; list-style: none;">
            ${order.items
            .map(
                (item) => `
                    <li style="margin-bottom: 20px; display: flex; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 12px;">
                        <img src="${item.product.images[0]}" alt="${item.product.name
                    }" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 16px;" />
                        <div>
                            <a href="https://himalayacarpets.com/admin/product/${item.product._id
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

        <h3 style="color: #333;">💳 Payment Summary</h3>
        <p>Status: <strong>${order.paymentStatus}</strong></p>
        <p>Method: <strong>${order.paymentMethod}</strong></p>
        <p>Total Paid: <strong>₹${order.totalAmount}</strong></p>

        <hr style="margin: 30px 0;" />
        <p style="font-size: 13px; color: #777;">
            This is an automated email notification from <strong>Himalaya Carpets</strong> Admin Panel.
        </p>
    </div>
    `;
};