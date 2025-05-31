-- Add video_url column to news table
ALTER TABLE news
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Create function to convert YouTube/Vimeo URLs to embed URLs
CREATE OR REPLACE FUNCTION convert_to_embed_url(url TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Convert YouTube URLs
  IF url ~ 'youtube\.com/watch\?v=' THEN
    RETURN 'https://www.youtube.com/embed/' || (regexp_match(url, 'v=([^&]+)'))[1];
  ELSIF url ~ 'youtu\.be/' THEN
    RETURN 'https://www.youtube.com/embed/' || (regexp_match(url, 'youtu\.be/([^?&]+)'))[1];
  -- Convert Vimeo URLs
  ELSIF url ~ 'vimeo\.com/' THEN
    RETURN 'https://player.vimeo.com/video/' || (regexp_match(url, 'vimeo\.com/(\d+)'))[1];
  END IF;
  RETURN url;
END;
$$ LANGUAGE plpgsql;