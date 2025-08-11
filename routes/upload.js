const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const auth = require('../middleware/auth');

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image'); // 'image' is the field name from the form

// Check File Type function
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// @route   POST /api/upload
// @desc    Upload an image
// @access  Private
router.post('/', auth, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        }
        if (req.file == undefined) {
            return res.status(400).json({ msg: 'Error: No File Selected!' });
        }
        // Return the path to the uploaded file
        res.json({
            msg: 'File uploaded successfully',
            filePath: `/uploads/${req.file.filename}`
        });
    });
});

module.exports = router;
