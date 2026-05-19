require('dotenv').config();
const crypto = require('crypto');

const generatedKey = process.env.ZAAKPAY_GENERATED_KEY;
const merchantIdentifier = process.env.ZAAKPAY_MERCHANT_IDENTIFIER;
const frontendUrl = process.env.FRONTEND_URL || 'https://geetanjalifarmfresh.com';
const backendUrl = process.env.BACKEND_URL || 'https://lightseagreen-tiger-123876.hostingersite.com';

const params = {
  amount: '10040',  // ₹100.40 in paise
  buyerEmail: 'test@example.com',
  buyerFirstName: 'Test',
  buyerLastName: 'User',
  buyerPhoneNumber: '9999999999',
  currency: 'INR',
  merchantIdentifier,
  mode: '0',
  orderId: 'TEST' + Date.now().toString().slice(-16),
  productDescription: 'TestOrder',
  purpose: '1',
  returnUrl: `${backendUrl}/api/orders/payment/callback?dbOrderId=test-id`,
  txnType: '1',
  zpPayOption: '1',
};

const str = Object.keys(params)
  .sort()
  .filter(k => params[k] !== '' && params[k] !== null && params[k] !== undefined)
  .map(k => `${k}=${params[k]}`)
  .join('&') + '&';

const checksum = crypto.createHmac('sha256', generatedKey).update(str).digest('hex');

console.log('\n=== ZAAKPAY TEST PARAMS ===');
console.log('Merchant Identifier:', merchantIdentifier);
console.log('Generated Key:', generatedKey);
console.log('\nChecksum String:\n', str);
console.log('\nChecksum:', checksum);
console.log('\nAll params being sent:');
console.log({ ...params, checksum });
console.log('\n=== IMPORTANT: Make sure these URLs are registered in Zaakpay Dashboard ===');
console.log('Website URL: https://geetanjalifarmfresh.com');
console.log('Redirect URL:', `${backendUrl}/api/orders/payment/callback`);
console.log('\nGo to: https://zaakpay.com/account/merchant-configurations');
console.log('OR: Zaakpay Dashboard > Developers > Integration URLs');
