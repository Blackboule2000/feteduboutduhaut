-- Create program table
CREATE TABLE IF NOT EXISTS program (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  stage TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE program ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Les administrateurs peuvent tout faire sur program"
ON program FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_program_updated_at
    BEFORE UPDATE ON program
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();