const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product banao
router.post('/onboard', productController.onboardProduct);

// Status update karo (Dashboard + Hash)
router.post('/update-status', productController.updateProductStatus);

// Dashboard view (Single product with full history)
router.get('/:id', productController.getProductDetails);

module.exports = router;