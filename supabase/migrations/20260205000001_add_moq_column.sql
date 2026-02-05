-- Add MOQ (Minimum Order Quantity) column to products table
-- This allows setting a minimum quantity customers must order for each product

ALTER TABLE products ADD COLUMN IF NOT EXISTS moq INTEGER DEFAULT 1;

-- Add a check constraint to ensure MOQ is at least 1
ALTER TABLE products ADD CONSTRAINT products_moq_positive CHECK (moq >= 1);

-- Update existing products to have MOQ of 1 if null
UPDATE products SET moq = 1 WHERE moq IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN products.moq IS 'Minimum Order Quantity - the minimum number of units a customer must order';
