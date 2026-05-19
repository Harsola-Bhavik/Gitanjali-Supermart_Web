const { z } = require('zod');

const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  image_url: z.string().optional(),
});

const createOrderSchema = z.object({
  body: z.object({
    customer_name: z.string().min(1, "Name is required").trim(),
    customer_phone: z.string().min(10, "Valid phone number required").trim(),
    customer_email: z.string().email("Valid email address required").trim(),
    customer_address: z.string().min(5, "Full address is required").trim(),
    items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
    notes: z.string().optional(),
    pickup_from_store: z.boolean().optional().default(false),
    payment_method: z.enum(['pickup', 'cod', 'upi']).optional().default('cod'),
  }).strict(),
  query: z.any(),
  params: z.any(),
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled']),
  }).strict(),
  query: z.any(),
  params: z.object({
    id: z.string().uuid("Invalid order ID"),
  }),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};
