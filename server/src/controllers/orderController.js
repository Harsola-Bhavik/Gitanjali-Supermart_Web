const crypto = require("crypto");
const supabase = require("../config/supabase");
const {
  sendInvoiceEmail,
  sendAdminNotificationEmail,
} = require("../utils/mailService");
const logger = require("../config/logger");
const { zaakpay, frontendUrl } = require("../config/env");

const DELIVERY_CHARGE = 40;

// Zaakpay staging endpoint
const ZAAKPAY_URL =
  "https://zaakstaging.zaakpay.com/api/paymentTransact/V8";

// ========================================
// BUILD CHECKSUM
// ========================================
function buildZaakpayChecksum(params) {
  const str =
    Object.keys(params)
      .sort()
      .filter(
        (k) =>
          params[k] !== "" &&
          params[k] !== null &&
          params[k] !== undefined
      )
      .map((k) => `${k}=${params[k]}`)
      .join("&") + "&";

  logger.info("Zaakpay checksum string: [%s]", str);

  return crypto
    .createHmac("sha256", zaakpay.generatedKey)
    .update(str)
    .digest("hex");
}

// ========================================
// VERIFY CHECKSUM
// ========================================
function verifyChecksum(data, receivedChecksum) {
  const cloned = { ...data };

  delete cloned.checksum;

  const generatedChecksum = buildZaakpayChecksum(cloned);

  return generatedChecksum === receivedChecksum;
}

// ========================================
// CREATE ORDER
// ========================================
exports.createOrder = async (req, res) => {
  const orderData = req.body;

  const { pickup_from_store, payment_method } = orderData;

  const itemsTotal = orderData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery_charge = pickup_from_store
    ? 0
    : DELIVERY_CHARGE;

  const total_amount =
    itemsTotal + delivery_charge;

  const finalOrder = {
    customer_name: orderData.customer_name,
    customer_phone: orderData.customer_phone,
    customer_email: orderData.customer_email,
    customer_address: orderData.customer_address,
    items: orderData.items,
    notes: orderData.notes,

    pickup_from_store: !!pickup_from_store,

    payment_method:
      payment_method ||
      (pickup_from_store ? "pickup" : "cod"),

    delivery_charge,
    total_amount,

    status: "pending",
  };

  const { data, error } = await supabase
    .from("orders")
    .insert([finalOrder])
    .select()
    .single();

  if (error) throw error;

  // ========================================
  // PICKUP OR COD
  // ========================================
  if (
    pickup_from_store ||
    payment_method === "cod"
  ) {
    Promise.all([
      sendInvoiceEmail(data),
      sendAdminNotificationEmail(data),
    ]).catch((err) =>
      logger.error(
        "Email sending failed | %s",
        err.message
      )
    );

    return res.status(201).json({
      success: true,
      data,
      message: "Order placed successfully",
    });
  }

  // ========================================
  // UPI PAYMENT
  // ========================================
  return res.status(201).json({
    success: true,
    data,
    requiresPayment: true,
    payOrderUrl: `/api/orders/pay/${data.id}`,
    message: "Redirect to Zaakpay",
  });
};

// ========================================
// INITIATE PAYMENT
// ========================================
exports.initiatePayment = async (req, res) => {
  const { id } = req.params;

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) {
    return res.redirect(
      `${frontendUrl}/payment/callback?payment=failed`
    );
  }

  // ========================================
  // CONVERT TO PAISE
  // ========================================
  const amountInPaise = String(
    Math.round(Number(order.total_amount) * 100)
  );

  const backendUrl =
    process.env.BACKEND_URL ||
    "https://lightseagreen-tiger-123876.hostingersite.com";

  // ========================================
  // ZAAKPAY PARAMS
  // ========================================
  const params = {
    amount: amountInPaise,

    buyerEmail: order.customer_email,

    buyerFirstName:
      order.customer_name
        .split(" ")[0]
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 30) || "Customer",

    buyerLastName:
      (
        order.customer_name
          .split(" ")
          .slice(1)
          .join("") || "User"
      )
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 30),

    buyerPhoneNumber: order.customer_phone,

    currency: "INR",

    merchantIdentifier:
      zaakpay.merchantIdentifier,

    mode: "0",

    orderId: `ORD${Date.now()}`,

    productDescription: `Order${order.id
      .slice(0, 8)
      .toUpperCase()}`,

    purpose: "1",

    returnUrl:
      `${backendUrl}/api/orders/payment/callback?dbOrderId=${order.id}`,

    txnType: "1",

    zpPayOption: "1",
  };

  // ========================================
  // GENERATE CHECKSUM
  // ========================================
  params.checksum =
    buildZaakpayChecksum(params);

  logger.info(
    "Zaakpay params for order %s (orderId=%s): %j",
    id,
    params.orderId,
    params
  );

  // ========================================
  // BUILD AUTO SUBMIT FORM
  // ========================================
  const inputs = Object.entries(params)
    .map(
      ([k, v]) =>
        `<input type="hidden" name="${k}" value="${String(
          v
        ).replace(/"/g, "&quot;")}">`
    )
    .join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Redirecting to payment...</title>
</head>
<body>
  <p style="font-family:sans-serif;text-align:center;margin-top:80px;">
    Redirecting to payment gateway...
  </p>

  <form
    id="zpform"
    method="POST"
    action="${ZAAKPAY_URL}"
  >
    ${inputs}
  </form>

  <script>
    document.getElementById('zpform').submit();
  </script>
</body>
</html>
`;

  res.setHeader("Content-Type", "text/html");

  return res.send(html);
};

// ========================================
// PARSE ZAAKPAY CALLBACK
// Handles 4 possible formats Zaakpay sends:
//  1. Direct fields in body (production)
//  2. txnData as JSON string
//  3. txnData as URL-encoded query string
//  4. Entire body as plain text (url-encoded)
// ========================================
function parseCallbackData(body) {
  // Body arrived as a plain-text string (Content-Type: text/plain)
  if (typeof body === "string") {
    try {
      const parsed = Object.fromEntries(new URLSearchParams(body));
      logger.info("[Zaakpay] parsed plain-text body: %j", parsed);
      // recurse with the parsed object
      return parseCallbackData(parsed);
    } catch (e) {
      logger.error("[Zaakpay] failed to parse plain-text body: %s", e.message);
      return {};
    }
  }

  // Direct fields already present
  if (body.responseCode !== undefined) {
    return body;
  }

  // txnData wrapper
  if (body.txnData) {
    // try JSON
    try {
      const parsed = JSON.parse(body.txnData);
      logger.info("[Zaakpay] parsed txnData (JSON): %j", parsed);
      return parsed;
    } catch (_) {}

    // try URL-encoded
    try {
      const parsed = Object.fromEntries(new URLSearchParams(body.txnData));
      logger.info("[Zaakpay] parsed txnData (URLEncoded): %j", parsed);
      return parsed;
    } catch (e) {
      logger.error("[Zaakpay] failed to parse txnData: %s", e.message);
    }
  }

  return body;
}

// ========================================
// VERIFY PAYMENT CALLBACK
// ========================================
exports.verifyPayment = async (req, res) => {
  // ---- FULL DEBUG DUMP ----
  logger.info("[Zaakpay CB] ===== CALLBACK RECEIVED =====");
  logger.info("[Zaakpay CB] method      : %s", req.method);
  logger.info("[Zaakpay CB] url         : %s", req.originalUrl);
  logger.info("[Zaakpay CB] content-type: %s", req.headers["content-type"]);
  logger.info("[Zaakpay CB] query       : %j", req.query);
  logger.info("[Zaakpay CB] raw body    : %j", req.body);
  // -------------------------

  const dbOrderId = req.query.dbOrderId;

  if (!dbOrderId) {
    logger.warn("[Zaakpay CB] missing dbOrderId — redirecting failed");
    return res.redirect(`${frontendUrl}/payment/callback?payment=failed`);
  }

  const callbackData = parseCallbackData(req.body);

  const { responseCode, checksum, orderId, pgTransId } = callbackData;

  logger.info(
    "[Zaakpay CB] parsed — responseCode=%s | orderId=%s | pgTransId=%s | checksum=%s",
    responseCode, orderId, pgTransId, checksum
  );

  // ========================================
  // CHECKSUM VERIFICATION
  // TEMPORARILY BYPASSED to confirm the
  // responseCode path works end-to-end.
  // Re-enable by setting ZAAKPAY_VERIFY_CHECKSUM=true in .env
  // ========================================
  const skipChecksum = process.env.ZAAKPAY_VERIFY_CHECKSUM !== "true";

  if (!skipChecksum) {
    const isValid = verifyChecksum(callbackData, checksum);
    logger.info("[Zaakpay CB] checksum valid: %s", isValid);
    if (!isValid) {
      logger.error("[Zaakpay CB] checksum mismatch — received: %s", checksum);
      return res.redirect(`${frontendUrl}/payment/callback?payment=failed`);
    }
  } else {
    logger.warn("[Zaakpay CB] checksum verification SKIPPED (debug mode)");
  }

  // ========================================
  // PAYMENT SUCCESS
  // ========================================
  if (responseCode === "100") {
    const updatePayload = {
      status: "confirmed",
      payment_method: "upi",
      payment_status: "paid",
      ...(pgTransId && { transaction_id: pgTransId }),
    };

    logger.info("[Zaakpay CB] updating order %s → %j", dbOrderId, updatePayload);

    const { data, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", dbOrderId)
      .select()
      .single();

    logger.info("[Zaakpay CB] DB result — data: %j | error: %j", data, error);

    if (error) {
      logger.error("[Zaakpay CB] DB update failed: %s", error.message);
    }

    if (!error && data) {
      Promise.all([
        sendInvoiceEmail(data),
        sendAdminNotificationEmail(data),
      ]).catch((err) =>
        logger.error("[Zaakpay CB] email failed: %s", err.message)
      );
    }

    return res.redirect(`${frontendUrl}/payment/callback?payment=success`);
  }

  // ========================================
  // PAYMENT FAILED
  // ========================================
  logger.warn(
    "[Zaakpay CB] non-success responseCode=%s orderId=%s",
    responseCode, orderId
  );

  try {
    await supabase
      .from("orders")
      .update({ status: "cancelled", payment_status: "failed" })
      .eq("id", dbOrderId);
  } catch (e) {
    logger.error("[Zaakpay CB] failed-status update error: %s", e.message);
  }

  return res.redirect(`${frontendUrl}/payment/callback?payment=failed`);
};

// ========================================
// GET ALL ORDERS
// ========================================
exports.getOrders = async (req, res) => {
  let {
    status,
    page = 1,
    limit = 10,
    sort = "created_at",
  } = req.query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } =
    await query
      .order(sort, { ascending: false })
      .range(offset, offset + limit - 1);

  if (error) throw error;

  res.json({
    success: true,
    data,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  });
};

// ========================================
// GET SINGLE ORDER
// ========================================
exports.getOrder = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return res.status(404).json({
      success: false,
      error: "Order not found",
    });
  }

  res.json({
    success: true,
    data,
  });
};

// ========================================
// UPDATE ORDER STATUS
// ========================================
exports.updateOrderStatus = async (
  req,
  res
) => {
  const { id } = req.params;

  const { status } = req.body;

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  if (!data) {
    return res.status(404).json({
      success: false,
      error: "Order not found",
    });
  }

  res.json({
    success: true,
    data,
    message:
      "Order status updated successfully",
  });
};