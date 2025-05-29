/*
  # Reset Statistics and Messages

  1. Changes
    - Truncate stats and sessions tables
    - Mark all contact messages as read
    - Insert initial records to maintain structure
    - Add table comments with reset timestamp
*/

-- Réinitialisation des statistiques
TRUNCATE TABLE stats;

-- Réinitialisation des sessions
TRUNCATE TABLE sessions;

-- Marquer tous les messages comme lus
UPDATE contact_messages
SET read = true
WHERE read = false;

-- Insérer une entrée initiale dans stats pour maintenir la structure
INSERT INTO stats (page_view, view_count, created_at)
VALUES ('/', 0, now());

-- Insérer une entrée initiale dans sessions pour maintenir la structure
INSERT INTO sessions (session_id, first_seen)
VALUES ('initial_session', now());

-- Commentaires sur les tables (utilisant la concaténation compatible PostgreSQL)
COMMENT ON TABLE stats IS 'Table réinitialisée le ' || to_char(now(), 'YYYY-MM-DD HH24:MI:SS');
COMMENT ON TABLE sessions IS 'Table réinitialisée le ' || to_char(now(), 'YYYY-MM-DD HH24:MI:SS');