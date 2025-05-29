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

-- Commentaire explicatif
COMMENT ON TABLE stats IS 'Table réinitialisée le ' || now()::text;
COMMENT ON TABLE sessions IS 'Table réinitialisée le ' || now()::text;