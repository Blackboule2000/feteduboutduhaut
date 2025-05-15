/*
  # Add image and color fields to program table

  1. New Fields
    - `image_url` : URL of the program item image
    - `color` : Custom color for the program item
*/

ALTER TABLE program
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#ca5231';