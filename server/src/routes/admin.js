const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const asyncWrapper = require('../utils/asyncWrapper');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/auth');
const { createProductSchema, updateProductSchema } = require('../validators/product.schema');
const { updateOrderStatusSchema } = require('../validators/order.schema');

// All admin routes require JWT auth
router.use(verifyToken);

// Dashboard
router.get('/dashboard', asyncWrapper(adminController.getDashboardStats));

// Products
router.post('/products', upload.single('image'), validate(createProductSchema), asyncWrapper(productController.createProduct));
router.put('/products/:id', upload.single('image'), validate(updateProductSchema), asyncWrapper(productController.updateProduct));
router.delete('/products/:id', asyncWrapper(productController.deleteProduct));

// Orders
router.get('/orders', asyncWrapper(orderController.getOrders));
router.get('/orders/:id', asyncWrapper(orderController.getOrder));
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), asyncWrapper(orderController.updateOrderStatus));

// Categories
router.get('/categories', asyncWrapper(categoryController.getCategories));
router.post('/categories', asyncWrapper(categoryController.createCategory));
router.delete('/categories/:id', asyncWrapper(categoryController.deleteCategory));

module.exports = router;
