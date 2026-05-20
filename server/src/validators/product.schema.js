const { z } = require('zod');

const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").trim(),
    description: z.string().optional(),
    price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Price must be a non-negative number",
    }),
    stock_quantity: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0, {
      message: "Stock must be a non-negative integer",
    }),
    category: z.string().min(1, "Category is required").trim(),
    unit: z.string().optional(),
    is_active: z.string().optional().transform(val => val === undefined ? true : val === 'true'),
    ingredients: z.string().optional(),
    manufacture_date: z.string().optional(),
    expiry_date: z.string().optional(),
    shelf_life: z.string().optional(),
    storage_instructions: z.string().optional(),
    net_weight: z.string().optional(),
  }).strict(),
  query: z.any(),
  params: z.any(),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").trim().optional(),
    description: z.string().optional(),
    price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Price must be a non-negative number",
    }).optional(),
    stock_quantity: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0, {
      message: "Stock must be a non-negative integer",
    }).optional(),
    category: z.string().min(1, "Category is required").trim().optional(),
    unit: z.string().optional(),
    is_active: z.string().optional().transform(val => val === undefined ? true : val === 'true'),
    ingredients: z.string().optional(),
    manufacture_date: z.string().optional(),
    expiry_date: z.string().optional(),
    shelf_life: z.string().optional(),
    storage_instructions: z.string().optional(),
    net_weight: z.string().optional(),
  }).strict(),
  query: z.any(),
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
