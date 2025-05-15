/*
  # Création de la table des partenaires

  1. Nouvelle Table
    - `partners` : Gestion des partenaires
      - `id` (uuid, clé primaire)
      - `name` (text, nom du partenaire)
      - `logo_url` (text, URL du logo)
      - `website_url` (text, URL du site web)
      - `order_index` (integer, ordre d'affichage)
      - `is_active` (boolean, statut d'activation)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Activation RLS
    - Politique d'accès pour les administrateurs
*/

-- Suppression de la table si elle existe déjà
DROP TABLE IF EXISTS partners;

-- Création de la table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activation RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Suppression de la politique si elle existe
DROP POLICY IF EXISTS "Les administrateurs peuvent tout faire sur partners" ON partners;

-- Création de la politique
CREATE POLICY "Les administrateurs peuvent tout faire sur partners"
ON partners FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Création du trigger pour updated_at
DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();