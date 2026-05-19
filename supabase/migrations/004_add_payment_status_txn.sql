-- Add payment_status and transaction_id columns to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_status  TEXT NOT NULL DEFAULT 'pending'
                             CHECK (payment_status IN ('pending', 'paid', 'failed')),
  ADD COLUMN IF NOT EXISTS transaction_id  TEXT;
