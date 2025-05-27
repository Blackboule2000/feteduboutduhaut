/*
  # Fix settings table permissions

  1. Changes
    - Drop existing policies
    - Create new policies with correct permissions
    - Ensure authenticated users can modify settings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON settings;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON settings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON settings;
DROP POLICY IF EXISTS "Permettre la lecture publique des paramètres" ON settings;

-- Create new policies
CREATE POLICY "Enable read access for all users"
ON settings FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);