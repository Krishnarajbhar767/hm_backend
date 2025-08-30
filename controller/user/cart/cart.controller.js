// get cart
// add to cart
// remove from cart
// merge Cart

const express = require("express");

const User = require("../../../model/User.model");
const Product = require("../../../model/Product.model");
// ------------------------
// 1. GET CART
// ------------------------
exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate(
            "cart.items.product"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract and flatten each cart item
        const cartProducts = user.cart.items.map((item) => {
            const product = item.product.toObject();

            return {
                ...product,
                _id: product._id, // 1ab9
                id: product._id,
                quantity: item.quantity,
                addons: {
                    withFallPico: item.addons.withFallPico,
                    withTassels: item.addons.withTassels,
                },
                finalPrice: item.finalPrice,
                totalPrice: item.totalPrice,
            };
        });
        console.log("Cart Data ", cartProducts);
        res.status(200).json(cartProducts);
    } catch (err) {
        console.error("Error fetching cart:", err.message);
        res.status(500).json({
            message: "Failed to fetch cart",
            error: err.message,
        });
    }
};

// ------------------------
// 2. ADD TO CART
// ------------------------
// cartRouter.post("/add" );
exports.addToCart = async (req, res) => {
    const { userId, product, quantity = 1, addons, finalPrice } = req.body;
    console.log(" add to cart product", product);
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const totalPrice = quantity * finalPrice;

        // Check if item already exists with the same customization
        const existingItem = user.cart.items.find(
            (item) =>
                item.product.toString() === product &&
                item.addons.withFallPico === addons.withFallPico &&
                item.addons.withTassels === addons.withTassels
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice += totalPrice;
        } else {
            user.cart.items.push({
                product,
                quantity,
                finalPrice,
                addons,
                totalPrice,
            });
        }

        // Recalculate total cart price
        user.cart.totalPrice = user.cart.items.reduce(
            (acc, item) => acc + item.totalPrice,
            0
        );

        await user.save();
        const updatedUser = await User.findById(userId)
            .populate("cart.items.product")
            .exec();

        // Flatten cart items
        const flattenedCartItems = updatedUser.cart.items.map((item) => {
            const product = item.product.toObject(); // Convert Mongoose document to plain object
            return {
                ...product, // Flatten product fields
                _id: product._id, // Retain the cart item _id .....
                finalPrice: item.finalPrice,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                addons: item.addons,
            };
        });
        res.status(200).json(flattenedCartItems);
    } catch (err) {
        res.status(500).json({
            message: "Failed to add to cart",
            error: err.message,
        });
    }
};

// ------------------------
// 3. REMOVE FROM CART
// ------------------------
exports.removeFromCart = async (req, res) => {
    const { userId, productId, withCustomization } = req.body;
    if (!userId || !productId) {
        return res.status(400).json({
            message: "All Field Are Required",
        });
    }
    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        user.cart.items = user.cart.items.filter(
            (item) =>
                !(
                    item.product.toString() === productId &&
                    item.withCustomization === withCustomization
                )
        );

        // Recalculate total cart price
        user.cart.totalPrice = user.cart.items.reduce(
            (acc, item) => acc + item.totalPrice,
            0
        );

        await user.save();
        return res.status(200).json({
            message: "Item removed from cart",
            cart: user.cart,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to remove item",
            error: err.message,
        });
    }
};

// ------------------------
// 4. MERGE CART
// ------------------------
// Accept localCart: { items: [...] }
// cartRouter.post("/merge", a);
exports.mergeCart = async (req, res) => {
    const { userId, localCartItems = [] } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const cart = user.cart || { items: [], totalPrice: 0 };

        for (const localItem of localCartItems) {
            const existing = cart.items.find(
                (item) => item.product.toString() === localItem._id
            );

            const quantity = localItem.quantity || 1;
            const finalPrice = localItem.finalPrice;
            const totalPrice = quantity * finalPrice;

            if (existing) {
                existing.quantity += quantity;
                existing.totalPrice += totalPrice;
            } else {
                cart.items.push({
                    product: localItem._id,
                    quantity,
                    finalPrice,
                    addons: {
                        withFallPico: localItem.withFallPico,
                        withTassels: localItem.withTassels,
                    },
                    totalPrice,
                });
            }
        }

        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.totalPrice,
            0
        );
        user.cart = cart;

        await user.save();
        res.status(200).json({ message: "Cart merged successfully", cart });
    } catch (err) {
        res.status(500).json({
            message: "Failed to merge cart",
            error: err.message,
        });
    }
};

exports.updateQuantity = async (req, res) => {
    const { userId, productId, withFallPico, withTassels, type } = req.body;

    console.log(withFallPico, withTassels);
    if (!userId || !productId || !type)
        return res.status(400).json({ message: "Missing required fields" });

    if (!["increment", "decrement"].includes(type))
        return res.status(400).json({ message: "Invalid update type" });

    try {
        const user = await User.findById(userId);
        const product = await Product.findById(productId);
        console.log("Product Id  And Product", productId, product);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        if (!user) return res.status(404).json({ message: "User not found" });

        const cart = user.cart;
        const item = cart.items.find(
            (i) =>
                i.product.toString() === productId &&
                i.addons.withFallPico === withFallPico &&
                i.addons.withTassels === withTassels
        );

        if (!item)
            return res.status(404).json({ message: "Item not found in cart" });

        // Adjust quantity
        if (type === "increment") {
            if (item.quantity === product.stock) {
                return res.error(`Only ${product.stock} in stock`, 400);
            }
            item.quantity += 1;
        } else {
            if (item.quantity === 1) {
                // Optionally remove item if quantity reaches 0
                cart.items = cart.items.filter(
                    (i) =>
                        !(
                            i.product.toString() === productId &&
                            i.withCustomization === withCustomization
                        )
                );
            } else {
                item.quantity -= 1;
            }
        }

        // Update total price for item and entire cart
        item.totalPrice = item.quantity * item.finalPrice;
        cart.totalPrice = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);

        await user.save();

        return res
            .status(200)
            .json({ message: "Cart updated", cart: user.cart });
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};
