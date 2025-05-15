/*
  # Add media fields to program table

  1. New Fields
    - `video_url`: For embedding YouTube or other video content
    - `audio_url`: For audio file URLs
    - `gallery_urls`: For multiple images (JSON array)
    - `background_image`: For section background
*/

ALTER TABLE program
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_urls JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS background_image TEXT;