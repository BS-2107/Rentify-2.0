-- Create payments table in Supabase
-- Run this SQL in your Supabase SQL editor (https://awngilvqwxukikhtfmjw.supabase.co)

CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id VARCHAR(255) NOT NULL UNIQUE,
  payer_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  tool_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  duration VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  payment_method VARCHAR(50) NOT NULL DEFAULT 'PayPal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Create an index on customer_email for customer lookups
CREATE INDEX IF NOT EXISTS idx_payments_customer_email ON payments(customer_email);

-- Enable Row Level Security (RLS)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert records (for payment processing)
CREATE POLICY "Allow insert for payments" ON payments
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows anyone to read records (for payment dashboard)
CREATE POLICY "Allow read for payments" ON payments
  FOR SELECT USING (true);

-- Optional: Create a policy to allow updates (in case you need to update payment status)
CREATE POLICY "Allow update for payments" ON payments
  FOR UPDATE USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function before any update
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional - for testing)
-- INSERT INTO payments (payment_id, amount, currency, status, tool_name, quantity, duration, customer_email, customer_name, payment_method)
-- VALUES 
--   ('PAY-1ABC123DEF456', 59.00, 'USD', 'COMPLETED', 'Adobe Photoshop', 1, '1 month', 'test@example.com', 'John Doe', 'PayPal'),
--   ('PAY-2XYZ789GHI012', 118.00, 'USD', 'COMPLETED', 'Adobe Illustrator', 2, '1 month', 'jane@example.com', 'Jane Smith', 'PayPal');
