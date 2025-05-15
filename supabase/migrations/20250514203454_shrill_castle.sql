-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Les administrateurs peuvent tout faire sur partners" ON partners;

-- Create partners table if it doesn't exist
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Les administrateurs peuvent tout faire sur partners"
ON partners FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;

-- Create trigger for updated_at
CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();