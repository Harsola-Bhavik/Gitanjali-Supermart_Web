const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const asyncWrapper = require('../utils/asyncWrapper');
const validate = require('../middleware/validate');
const { createOrderSchema } = require('../validators/order.schema');
const rateLimit = require('express-rate-limit');

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many orders placed, please try again later.' }
});

// Public routes
router.post('/', orderLimiter, validate(createOrderSchema), asyncWrapper(orderController.createOrder));
router.get('/pay/:id', asyncWrapper(orderController.initiatePayment));
router.post('/payment/callback', asyncWrapper(orderController.verifyPayment));
router.get('/payment/callback', asyncWrapper(orderController.verifyPayment));

module.exports = router;
