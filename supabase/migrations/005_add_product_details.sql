-- Add product detail fields
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS ingredients          TEXT,
  ADD COLUMN IF NOT EXISTS manufacture_date     TEXT,
  ADD COLUMN IF NOT EXISTS expiry_date          TEXT,
  ADD COLUMN IF NOT EXISTS shelf_life           TEXT,
  ADD COLUMN IF NOT EXISTS storage_instructions TEXT,
  ADD COLUMN IF NOT EXISTS net_weight           TEXT;
