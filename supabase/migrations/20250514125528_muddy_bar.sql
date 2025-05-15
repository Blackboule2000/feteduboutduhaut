/*
  # Update stats table RLS policies

  1. Changes
    - Remove existing RLS policy that only allows authenticated users
    - Add new policy to allow public inserts for page view tracking
    - Add policy to allow authenticated users full access

  2. Security
    - Enable RLS on stats table (already enabled)
    - Allow public to insert new page views
    - Maintain admin access for authenticated users
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Les administrateurs peuvent tout faire sur stats" ON "public"."stats";

-- Create policy for public inserts
CREATE POLICY "Allow public to insert page views"
ON "public"."stats"
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy for authenticated users to have full access
CREATE POLICY "Enable full access for authenticated users"
ON "public"."stats"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);