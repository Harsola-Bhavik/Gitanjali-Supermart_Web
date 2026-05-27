const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const morgan = require('morgan');

const logger = require('./src/config/logger');
const env = require('./src/config/env');
const errorHandler = require('./src/middleware/errorHandler');

// Routes
const productsRoutes = require('./src/routes/products');
const ordersRoutes = require('./src/routes/orders');
const adminRoutes = require('./src/routes/admin');
const categoriesRoutes = require('./src/routes/categories');

const supabase = require('./src/config/supabase');

const app = express();

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: env.env === 'production' ? undefined : false,
  })
);

// CORS Configuration
app.use(
  cors({
    origin: [
      'https://geetanjalifarmfresh.com',
      'https://www.geetanjalifarmfresh.com',
      'https://lightseagreen-tiger-123876.hostingersite.com',
      'https://zaakpay.com',
      'http://localhost:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
);

// Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
});

app.use(globalLimiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// express.text() only for Zaakpay callback — scoped to avoid consuming multipart/form-data streams
app.use('/api/orders/payment/callback', express.text({ type: '*/*', limit: '10mb' }));

// Prevent HTTP Parameter Pollution
// NOTE: hpp is applied AFTER body parsers but EXCLUDED for the Zaakpay
// callback route so it cannot strip fields from the callback payload.
app.use((req, res, next) => {
  if (req.path === '/api/orders/payment/callback') return next();
  hpp()(req, res, next);
});

// Logging
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend running successfully',
  });
});

// Health Checks
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: env.env,
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (error) throw error;

    res.json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('DB Health Check Failed', error);

    res.status(503).json({
      status: 'error',
      db: 'disconnected',
    });
  }
});


// API Routes
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoriesRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || env.port || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${env.env} mode on port ${PORT}`);
});

// Graceful Shutdown
const gracefulShutdown = () => {
  logger.info('SIGTERM/SIGINT signal received: closing HTTP server');

  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Uncaught Exception Handler
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

// Unhandled Rejection Handler
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION: %s', err?.message || err);
});