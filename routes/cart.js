const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Models
const User = require('../models/User');
const Product = require('../models/Product');

// @route   GET /api/cart
// @desc    Get user's shopping cart
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'cart.product',
            model: 'Product'
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/cart
// @desc    Add/update a product in the cart
// @access  Private
router.post('/', auth, async (req, res) => {
    const { productId, quantity } = req.body;
    const numQuantity = Number(quantity);

    if (numQuantity <= 0) {
        return res.status(400).json({ msg: 'Quantity must be positive' });
    }

    try {
        const user = await User.findById(req.user.id);
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex > -1) {
            // If item exists, update its quantity
            user.cart[cartItemIndex].quantity = numQuantity;
        } else {
            // If item doesn't exist, add it to the cart
            user.cart.push({ product: productId, quantity: numQuantity });
        }

        await user.save();
        const populatedUser = await User.findById(req.user.id).populate('cart.product');
        res.json(populatedUser.cart);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove a product from cart
// @access  Private
router.delete('/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Filter out the product to be removed
        user.cart = user.cart.filter(
            ({ product }) => product.toString() !== req.params.productId
        );

        await user.save();
        const populatedUser = await User.findById(req.user.id).populate('cart.product');
        res.json(populatedUser.cart);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
