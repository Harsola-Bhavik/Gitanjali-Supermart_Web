-- Add payment and pickup columns to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_email    TEXT,
  ADD COLUMN IF NOT EXISTS pickup_from_store BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS payment_method    TEXT NOT NULL DEFAULT 'cod'
                             CHECK (payment_method IN ('pickup', 'cod', 'upi')),
  ADD COLUMN IF NOT EXISTS delivery_charge   NUMERIC(10,2) NOT NULL DEFAULT 0;
