const logger = require('../config/logger');
const env = require('../config/env');
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, url: req.originalUrl, method: req.method });

  // Payment callback must always redirect, never return JSON
  if (req.path === '/api/orders/payment/callback') {
    const { frontendUrl } = require('../config/env');
    const base = frontendUrl || 'https://geetanjalifarmfresh.com';
    return res.redirect(`${base}/payment/callback?payment=failed`);
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: err.message });
  }

  // Handle specific Supabase DB errors if needed
  if (err.code && err.code.startsWith('23')) {
    // Postgres integrity constraint violations
    return res.status(400).json({ success: false, error: 'Database integrity violation.' });
  }

  const statusCode = err.statusCode || 500;
  const message = env.env === 'production' && statusCode === 500 
    ? 'Something went wrong' 
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(env.env === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
