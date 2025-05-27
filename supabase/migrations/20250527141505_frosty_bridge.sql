/*
  # Amélioration du suivi des statistiques

  1. Nouvelles tables
    - `sessions`
      - `session_id` (text, primary key)
      - `first_seen` (timestamp)
      - `session_start` (timestamp)

  2. Modifications de la table stats
    - Ajout de la colonne `session_id` (text, foreign key)
    - Ajout de la colonne `visitor_id` (text)
    - Ajout de la colonne `user_agent` (text)
    - Ajout de la colonne `referrer` (text)
    - Ajout de la colonne `session_duration` (integer)
    - Ajout de la colonne `country` (text)
    - Ajout de la colonne `region` (text)
    - Ajout de la colonne `city` (text)
    - Ajout de la colonne `latitude` (double precision)
    - Ajout de la colonne `longitude` (double precision)

  3. Indexes
    - Ajout d'index sur les colonnes fréquemment utilisées pour les requêtes
*/

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  session_id text PRIMARY KEY,
  first_seen timestamptz,
  session_start timestamptz DEFAULT now()
);

-- Add new columns to stats table
ALTER TABLE stats
ADD COLUMN IF NOT EXISTS session_id text REFERENCES sessions(session_id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS visitor_id text,
ADD COLUMN IF NOT EXISTS user_agent text,
ADD COLUMN IF NOT EXISTS referrer text,
ADD COLUMN IF NOT EXISTS session_duration integer,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stats_session_id ON stats(session_id);
CREATE INDEX IF NOT EXISTS idx_stats_visitor_id ON stats(visitor_id);
CREATE INDEX IF NOT EXISTS idx_stats_created_at ON stats(created_at);
CREATE INDEX IF NOT EXISTS idx_stats_page_view ON stats(page_view);
CREATE INDEX IF NOT EXISTS idx_stats_country ON stats(country);
CREATE INDEX IF NOT EXISTS idx_sessions_first_seen ON sessions(first_seen);