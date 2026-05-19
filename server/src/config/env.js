require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5173'],
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  adminEmail: process.env.ADMIN_EMAIL || 'support@geetanjalifarmfresh.com',
  zaakpay: {
    merchantIdentifier: process.env.ZAAKPAY_MERCHANT_IDENTIFIER,
    generatedKey: process.env.ZAAKPAY_GENERATED_KEY,
    publicKey: process.env.ZAAKPAY_PUBLIC_KEY,
    encryptionKeyId: process.env.ZAAKPAY_ENCRYPTION_KEY_ID,
    isTest: process.env.ZAAKPAY_ENV !== 'production',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
