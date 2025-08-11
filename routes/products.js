const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Models
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products with filtering, searching, sorting, and pagination
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Destructure query parameters with defaults for pagination
        const { search, category, minPrice, maxPrice, sortBy, page = 1, limit = 9 } = req.query;

        // Build query object for filtering
        let query = {};
        if (search) query.name = { $regex: search, $options: 'i' };
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        // Build sort object
        let sortOptions = { createdAt: -1 };
        if (sortBy) {
            const parts = sortBy.split('_');
            if (parts.length === 2) {
                sortOptions = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 };
            }
        }

        // Pagination logic
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query for total count and for paginated results
        const totalProducts = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('seller', 'username')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        res.json({
            products,
            currentPage: pageNum,
            totalPages: Math.ceil(totalProducts / limitNum),
            totalProducts,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'username');
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        // If the ID format is invalid, also return 404
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/products
// @desc    Create a new product listing
// @access  Private (Farmers only)
router.post('/', auth, async (req, res) => {
    // Authorization: Check user role
    if (req.user.role !== 'farmer') {
        return res.status(403).json({ msg: 'Access denied. Only farmers can create products.' });
    }

    const { name, description, quantity, price } = req.body;

    // Basic validation
    if (!name || !quantity || !price) {
        return res.status(400).json({ msg: 'Please include a name, quantity, and price.' });
    }

    try {
        const newProduct = new Product({
            name,
            description,
            quantity,
            price,
            seller: req.user.id // Assign the logged-in user as the seller
        });

        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product listing
// @access  Private (Owner only)
router.put('/:id', auth, async (req, res) => {
    const { name, description, quantity, price } = req.body;

    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (quantity) productFields.quantity = quantity;
    if (price) productFields.price = price;

    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Authorization: Make sure user owns the product
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true } // Return the modified document
        );

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Authorization: Make sure user owns the product
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
