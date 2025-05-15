/*
  # Program Table Setup

  1. New Table
    - `program` : Manage program schedule
      - `id` (uuid, primary key)
      - `time` (text, required)
      - `title` (text, required)
      - `description` (text, optional)
      - `stage` (text, required)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Policy for authenticated users
*/

-- Create program table if it doesn't exist
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

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Les administrateurs peuvent tout faire sur program" ON program;

-- Create policy for authenticated users
CREATE POLICY "Les administrateurs peuvent tout faire sur program"
ON program FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_program_updated_at ON program;

-- Create trigger for updated_at
CREATE TRIGGER update_program_updated_at
    BEFORE UPDATE ON program
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();