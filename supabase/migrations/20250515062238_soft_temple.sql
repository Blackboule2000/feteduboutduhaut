/*
  # Fix settings table RLS policies

  1. Changes
    - Drop existing RLS policies
    - Add new policy to allow public to read settings
    - Add policy to allow authenticated users to insert/update settings
    - Add policy to allow public to select settings
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Les administrateurs peuvent tout faire sur settings" ON settings;
DROP POLICY IF EXISTS "Anyone can read settings" ON settings;
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON settings;

-- Create new policies
CREATE POLICY "Enable read access for all users"
ON settings FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON settings FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Make sure RLS is enabled
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;