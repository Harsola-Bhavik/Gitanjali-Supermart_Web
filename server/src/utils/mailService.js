const nodemailer = require('nodemailer');
const { smtp, adminEmail } = require('../config/env');

function getTransporter() {
  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
    tls: { rejectUnauthorized: false },
  });
}

function buildInvoiceHtml(order) {
  const { id, customer_name, customer_email, customer_phone, customer_address, items, total_amount, delivery_charge, pickup_from_store, payment_method, notes, created_at } = order;
  const orderDate = new Date(created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const itemsSubtotal = items.reduce((s, i) => s + (i.price * i.quantity), 0);
  const dc = Number(delivery_charge || 0);

  const itemRows = items.map(item => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${item.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">₹${Number(item.price).toFixed(2)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`).join('');

  const deliveryRow = dc > 0 ? `
    <tr>
      <td colspan="3" style="padding:10px 12px;text-align:right;font-size:13px;color:#6b7280;">Delivery Charge</td>
      <td style="padding:10px 12px;text-align:right;font-size:13px;color:#374151;font-weight:600;">₹${dc.toFixed(2)}</td>
    </tr>` : '';

  const paymentLabel = pickup_from_store ? 'Store Pickup' : (payment_method === 'upi' ? 'UPI (Zaakpay)' : 'Cash on Delivery');


  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Order Invoice</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">🌿 Geetanjali Farm Fresh</h1>
            <p style="margin:6px 0 0;color:#bbf7d0;font-size:14px;">Fresh from Farm to Your Doorstep</p>
          </td>
        </tr>
        <!-- Thank You Banner -->
        <tr>
          <td style="background:#f0fdf4;padding:20px 40px;text-align:center;border-bottom:1px solid #dcfce7;">
            <h2 style="margin:0;color:#15803d;font-size:20px;">Thank You for Your Order! 🎉</h2>
            <p style="margin:6px 0 0;color:#4b5563;font-size:14px;">Your order has been received and is being processed.</p>
          </td>
        </tr>
        <!-- Order Meta -->
        <tr>
          <td style="padding:28px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:50%;vertical-align:top;">
                  <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Order ID</p>
                  <p style="margin:0;font-size:13px;color:#111827;font-weight:600;">#${id.slice(0, 8).toUpperCase()}</p>
                </td>
                <td style="width:50%;vertical-align:top;text-align:right;">
                  <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Order Date</p>
                  <p style="margin:0;font-size:13px;color:#111827;font-weight:600;">${orderDate}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Customer Details -->
        <tr>
          <td style="padding:24px 40px 0;">
            <h3 style="margin:0 0 12px;font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #16a34a;padding-bottom:8px;">Customer Details</h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#6b7280;width:120px;">Name</td>
                <td style="padding:4px 0;font-size:13px;color:#111827;font-weight:500;">${customer_name}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#6b7280;">Phone</td>
                <td style="padding:4px 0;font-size:13px;color:#111827;font-weight:500;">${customer_phone}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#6b7280;">Email</td>
                <td style="padding:4px 0;font-size:13px;color:#111827;font-weight:500;">${customer_email}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#6b7280;vertical-align:top;">Address</td>
                <td style="padding:4px 0;font-size:13px;color:#111827;font-weight:500;">${customer_address}</td>
              </tr>
              ${notes ? `<tr><td style="padding:4px 0;font-size:13px;color:#6b7280;vertical-align:top;">Notes</td><td style="padding:4px 0;font-size:13px;color:#111827;">${notes}</td></tr>` : ''}
            </table>
          </td>
        </tr>
        <!-- Items Table -->
        <tr>
          <td style="padding:24px 40px 0;">
            <h3 style="margin:0 0 12px;font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #16a34a;padding-bottom:8px;">Order Items</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              <thead>
                <tr style="background:#f9fafb;">
                  <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Product</th>
                  <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Price</th>
                  <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Subtotal</th>
                </tr>
              </thead>
              <tbody>${itemRows}${deliveryRow}</tbody>
            </table>
          </td>
        </tr>
        <!-- Total -->
        <tr>
          <td style="padding:16px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td></td>
                <td style="width:240px;background:#f0fdf4;border-radius:8px;padding:14px 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${dc > 0 ? `<tr><td style="font-size:13px;color:#6b7280;">Items Subtotal</td><td style="font-size:13px;color:#374151;text-align:right;">₹${itemsSubtotal.toFixed(2)}</td></tr><tr><td style="font-size:13px;color:#6b7280;">Delivery Charge</td><td style="font-size:13px;color:#374151;font-weight:600;text-align:right;">₹${dc.toFixed(2)}</td></tr>` : ''}
                    <tr>
                      <td style="font-size:15px;color:#374151;font-weight:600;padding-top:8px;">Total Amount</td>
                      <td style="font-size:18px;color:#16a34a;font-weight:700;text-align:right;padding-top:8px;">₹${Number(total_amount).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="font-size:12px;color:#6b7280;padding-top:6px;">Payment Method</td>
                      <td style="font-size:12px;color:#374151;font-weight:600;text-align:right;padding-top:6px;">${paymentLabel}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:32px 40px;text-align:center;border-top:1px solid #f0f0f0;margin-top:24px;">
            <p style="margin:0 0 8px;font-size:14px;color:#374151;font-weight:600;">We'll contact you shortly to confirm your delivery.</p>
            <p style="margin:0;font-size:13px;color:#9ca3af;">Questions? Reach us at <a href="mailto:support@geetanjalifarmfresh.com" style="color:#16a34a;text-decoration:none;">support@geetanjalifarmfresh.com</a></p>
            <p style="margin:16px 0 0;font-size:12px;color:#d1d5db;">© ${new Date().getFullYear()} Geetanjali Farm Fresh. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildAdminNotificationHtml(order) {
  const { id, customer_name, customer_email, customer_phone, customer_address, items, total_amount, notes, created_at } = order;
  const orderDate = new Date(created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const itemList = items.map(i => `• ${i.name} × ${i.quantity} @ ₹${Number(i.price).toFixed(2)} = ₹${(i.price * i.quantity).toFixed(2)}`).join('<br>');

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <h2 style="margin:0 0 4px;color:#15803d;">🛒 New Order Received</h2>
    <p style="margin:0 0 20px;color:#6b7280;font-size:13px;">${orderDate}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
      <tr><td style="padding:6px 0;color:#6b7280;width:130px;">Order ID</td><td style="padding:6px 0;color:#111827;font-weight:600;">#${id.slice(0, 8).toUpperCase()}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Customer</td><td style="padding:6px 0;color:#111827;">${customer_name}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;color:#111827;">${customer_email}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;color:#111827;">${customer_phone}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;vertical-align:top;">Address</td><td style="padding:6px 0;color:#111827;">${customer_address}</td></tr>
      ${notes ? `<tr><td style="padding:6px 0;color:#6b7280;vertical-align:top;">Notes</td><td style="padding:6px 0;color:#111827;">${notes}</td></tr>` : ''}
    </table>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
    <h3 style="margin:0 0 12px;font-size:14px;color:#374151;">Items</h3>
    <p style="font-size:13px;color:#374151;line-height:1.8;">${itemList}</p>
    <div style="background:#f0fdf4;border-radius:8px;padding:14px 16px;margin-top:16px;display:flex;justify-content:space-between;">
      <span style="font-size:15px;color:#374151;font-weight:600;">Total</span>
      <span style="font-size:18px;color:#16a34a;font-weight:700;">₹${Number(total_amount).toFixed(2)}</span>
    </div>
  </div>
</body></html>`;
}

async function sendInvoiceEmail(order) {
  await getTransporter().sendMail({
    from: `"Geetanjali Farm Fresh" <${smtp.user}>`,
    to: order.customer_email,
    subject: `Your Order Confirmation – #${order.id.slice(0, 8).toUpperCase()}`,
    html: buildInvoiceHtml(order),
  });
}

async function sendAdminNotificationEmail(order) {
  await getTransporter().sendMail({
    from: `"Geetanjali Farm Fresh" <${smtp.user}>`,
    to: adminEmail,
    subject: `New Order #${order.id.slice(0, 8).toUpperCase()} – ₹${Number(order.total_amount).toFixed(2)}`,
    html: buildAdminNotificationHtml(order),
  });
}

module.exports = { sendInvoiceEmail, sendAdminNotificationEmail };
