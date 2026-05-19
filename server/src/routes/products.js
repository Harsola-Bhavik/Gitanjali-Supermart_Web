const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const asyncWrapper = require('../utils/asyncWrapper');

// Public routes
router.get('/', asyncWrapper(productController.getProducts));
router.get('/:id', asyncWrapper(productController.getProduct));

module.exports = router;
