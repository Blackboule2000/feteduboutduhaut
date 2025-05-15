/*
  # Création des tables pour le back-office

  1. Nouvelles Tables
    - `concerts` : Gestion des concerts
    - `activities` : Gestion des activités
    - `settings` : Paramètres généraux du festival
    - `stats` : Statistiques de consultation

  2. Sécurité
    - Activation RLS sur toutes les tables
    - Politiques d'accès pour les administrateurs
*/

-- Table des concerts
CREATE TABLE IF NOT EXISTS concerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  time TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des activités
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  time TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des paramètres
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table des statistiques
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_view TEXT NOT NULL,
  view_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activation RLS
ALTER TABLE concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Politiques pour concerts
CREATE POLICY "Les administrateurs peuvent tout faire sur concerts"
ON concerts FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Politiques pour activities
CREATE POLICY "Les administrateurs peuvent tout faire sur activities"
ON activities FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Politiques pour settings
CREATE POLICY "Les administrateurs peuvent tout faire sur settings"
ON settings FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Politiques pour stats
CREATE POLICY "Les administrateurs peuvent tout faire sur stats"
ON stats FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Fonction de mise à jour automatique du updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_concerts_updated_at
    BEFORE UPDATE ON concerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();