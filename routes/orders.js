const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Models
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product'); // Needed for populating cart

// @route   POST /api/orders
// @desc    Create a new order from the user's cart
// @access  Private
router.post('/', auth, async (req, res) => {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
        return res.status(400).json({ msg: 'Please provide a shipping address.' });
    }

    try {
        // Find the user and populate the product details in their cart
        const user = await User.findById(req.user.id).populate('cart.product');

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        const cartItems = user.cart;

        if (cartItems.length === 0) {
            return res.status(400).json({ msg: 'Your cart is empty.' });
        }

        // Calculate total price and prepare products for the order
        let totalPrice = 0;
        const orderProducts = cartItems.map(item => {
            const itemPrice = item.product.price * item.quantity;
            totalPrice += itemPrice;
            return {
                productId: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price
            };
        });

        // Create a new order instance
        const newOrder = new Order({
            user: req.user.id,
            products: orderProducts,
            totalPrice,
            shippingAddress
        });

        // Save the order to the database
        const order = await newOrder.save();

        // Clear the user's cart
        user.cart = [];
        await user.save();

        res.status(201).json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/orders
// @desc    Get the logged-in user's order history
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
