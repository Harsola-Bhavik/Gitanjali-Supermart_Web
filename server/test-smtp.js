require('dotenv').config();
const nodemailer = require('nodemailer');

const config = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
};

console.log('--- SMTP Config ---');
console.log('Host :', config.host);
console.log('Port :', config.port);
console.log('Secure:', config.secure);
console.log('User :', config.user);
console.log('Pass :', config.pass ? '*** set ***' : '*** MISSING ***');
console.log('-------------------');

async function run() {
  // Test 1: port 587 STARTTLS
  await testTransport('Port 587 STARTTLS', { host: config.host, port: 587, secure: false, auth: { user: config.user, pass: config.pass }, tls: { rejectUnauthorized: false } });
  // Test 2: port 465 SSL
  await testTransport('Port 465 SSL', { host: config.host, port: 465, secure: true, auth: { user: config.user, pass: config.pass }, tls: { rejectUnauthorized: false } });
  // Test 3: port 25
  await testTransport('Port 25', { host: config.host, port: 25, secure: false, auth: { user: config.user, pass: config.pass }, tls: { rejectUnauthorized: false } });
}

async function testTransport(label, transportConfig) {
  process.stdout.write(`\nTesting [${label}]... `);
  const t = nodemailer.createTransport(transportConfig);
  try {
    await t.verify();
    console.log('✅ CONNECTED & AUTHENTICATED');
    // Try sending a real test email
    try {
      const info = await t.sendMail({
        from: `"SMTP Test" <${config.user}>`,
        to: config.user,
        subject: 'SMTP Test - Geetanjali Farm Fresh',
        text: 'If you receive this, SMTP is working correctly.',
      });
      console.log('   ✅ TEST EMAIL SENT — MessageId:', info.messageId);
    } catch (sendErr) {
      console.log('   ❌ SEND FAILED:', sendErr.message);
    }
  } catch (err) {
    console.log('❌ FAILED');
    console.log('   Code   :', err.code);
    console.log('   Message:', err.message);
    if (err.response) console.log('   Response:', err.response);
  }
}

run().catch(console.error);
