/*
  # Add RLS policies for settings table

  1. Security Changes
    - Enable RLS on settings table
    - Add policies for:
      - Public read access to settings
      - Authenticated users can manage settings
*/

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read settings
CREATE POLICY "Anyone can read settings"
  ON settings
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage settings
CREATE POLICY "Authenticated users can manage settings"
  ON settings
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');