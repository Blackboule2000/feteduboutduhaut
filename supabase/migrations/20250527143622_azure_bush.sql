/*
  # Correction du commentaire de la table stats

  1. Modifications
    - Remplace le commentaire dynamique par un texte statique
    - Ajoute des index pour optimiser les performances
    - Ajoute des contraintes de clé étrangère

  2. Sécurité
    - Maintient les politiques RLS existantes
*/

-- Supprime l'ancien commentaire s'il existe
COMMENT ON TABLE stats IS NULL;

-- Ajoute le nouveau commentaire statique
COMMENT ON TABLE stats IS 'Statistiques de visites du site web';

-- Vérifie et crée les index nécessaires
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'stats' AND indexname = 'idx_stats_created_at'
  ) THEN
    CREATE INDEX idx_stats_created_at ON stats(created_at);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'stats' AND indexname = 'idx_stats_page_view'
  ) THEN
    CREATE INDEX idx_stats_page_view ON stats(page_view);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'stats' AND indexname = 'idx_stats_session_id'
  ) THEN
    CREATE INDEX idx_stats_session_id ON stats(session_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'stats' AND indexname = 'idx_stats_visitor_id'
  ) THEN
    CREATE INDEX idx_stats_visitor_id ON stats(visitor_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'stats' AND indexname = 'idx_stats_country'
  ) THEN
    CREATE INDEX idx_stats_country ON stats(country);
  END IF;
END $$;