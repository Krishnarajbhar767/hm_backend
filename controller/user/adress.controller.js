const Address = require("../../model/Adress.model");
const User = require("../../model/User.model");
const mongoose = require("mongoose");

// Add Address
exports.addAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            street,
            city,
            state,
            postalCode,
            country = "India",
            phone,
        } = req?.body;

        // Validate required fields
        if (!street || !city || !state || !postalCode || !country || !phone) {
            return res
                .status(400)
                .json({ error: "All address fields are required" });
        }

        // Optional: Validate format
        const isValidPostalCode = /^[0-9]{5,6}$/.test(postalCode);
        const isValidPhone = /^[1-9][0-9]{9}$/.test(phone);

        if (!isValidPostalCode || !isValidPhone) {
            return res
                .status(400)
                .json({ error: "Invalid postal code or phone number" });
        }

        const newAddress = await Address.create({
            street,
            city,
            state,
            postalCode,
            country,
            phone,
            user: userId,
        });

        const user = await User.findById(userId);
        user.shippingAddress.push(newAddress._id);

        if (!user.defaultAddress) {
            user.defaultAddress = newAddress._id;
        }

        await user.save();

        res.status(201).json({
            message: "Address added",
            address: newAddress,
            user,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all addresses
exports.getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("shippingAddress")
            .populate("defaultAddress");

        res.status(200).json({
            addresses: user.shippingAddress,
            defaultAddress: user.defaultAddress,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user._id);

        // check dose provided address id exit or not in shipping adresses of User
        if (!user.shippingAddress.includes(id)) {
            return res
                .status(400)
                .json({ error: "Address not found in user account" });
        }

        user.defaultAddress = id;
        await user.save();
        const address = await Address.findById(id);
        res.status(200).json({
            message: "Default address updated",
            defaultAddress: address,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
    try {
        // get id of adress
        const { id } = req.params;
        // find user
        const user = await User.findById(req.user._id);

        // Remove from user
        user.shippingAddress = user.shippingAddress.filter(
            (addrId) => addrId.toString() !== id
        );
        // if deleted defualt address then set first shipping adress of user as default adress. If There Is Nor Any Address  Then Sut Null As Default Address
        if (user.defaultAddress?.toString() === id) {
            user.defaultAddress = user.shippingAddress[0] || null;
        }

        await user.save();
        await Address.findByIdAndDelete(id);

        res.status(200).json({ message: "Address deleted", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Address
exports.updateAddress = async (req, res) => {
    try {
        // get adress id
        const { id } = req.params;
        // get all required details of adress
        const { street, city, state, postalCode, country, phone } = req.body;
        // check is all required details of adress are available or not
        if (!street || !city || !state || !postalCode || !country || !phone) {
            return res
                .status(400)
                .json({ error: "All address fields are required" });
        }
        //  if all data got then update adress, find adress by address id ad user id
        const updatedAddress = await Address.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { street, city, state, postalCode, country, phone },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ error: "Address not found" });
        }

        res.status(200).json({
            message: "Address updated",
            address: updatedAddress,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
