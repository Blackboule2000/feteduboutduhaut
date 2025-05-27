-- Add visitor_id column to stats table
ALTER TABLE stats
ADD COLUMN IF NOT EXISTS visitor_id TEXT,
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Create index on visitor_id and session_id for better performance
CREATE INDEX IF NOT EXISTS idx_stats_visitor_id ON stats(visitor_id);
CREATE INDEX IF NOT EXISTS idx_stats_session_id ON stats(session_id);

-- Add foreign key constraint to sessions table
ALTER TABLE stats
ADD CONSTRAINT fk_stats_session
FOREIGN KEY (session_id)
REFERENCES sessions(session_id)
ON DELETE SET NULL;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_stats_created_at ON stats(created_at);
CREATE INDEX IF NOT EXISTS idx_stats_page_view ON stats(page_view);
CREATE INDEX IF NOT EXISTS idx_stats_country ON stats(country);

-- Add session_start column to sessions table
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS session_start TIMESTAMPTZ DEFAULT now();

-- Add indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_first_seen ON sessions(first_seen);