/*
  # Ajout des tables pour les partenaires et la personnalisation

  1. Nouvelles Tables
    - `partners` : Gestion des partenaires
      - `id` (uuid, clé primaire)
      - `name` (text, nom du partenaire)
      - `logo_url` (text, URL du logo)
      - `website_url` (text, URL du site web)
      - `order_index` (integer, ordre d'affichage)
      - `is_active` (boolean, statut d'affichage)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Nouvelles colonnes dans settings
    - Ajout de nouveaux champs pour la personnalisation du site

  3. Sécurité
    - Activation RLS
    - Politiques d'accès pour les administrateurs
*/

-- Table des partenaires
CREATE TABLE IF NOT EXISTS partners (
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

-- Politique pour les partenaires
CREATE POLICY "Les administrateurs peuvent tout faire sur partners"
ON partners FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Trigger pour updated_at
CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertion des paramètres de personnalisation par défaut
INSERT INTO settings (key, value) VALUES
  ('site_colors', '{"primary":"#ca5231","secondary":"#f6d9a0","accent":"#365d66"}'),
  ('site_fonts', '{"title":"Swiss 721 Black Extended BT","body":"Rainy Days"}'),
  ('festival_info', '{"name":"Fête du Bout du Haut","date":"2025-07-26","location":"Lachapelle sous Gerberoy"}'),
  ('contact_info', '{"email":"association.boutduhaut@gmail.com","phone":"+33623456789"}'),
  ('social_media', '{"facebook":"https://www.facebook.com/AssociationDuBoutDuHaut","instagram":"https://www.instagram.com/association_du_bout_du_haut"}')
ON CONFLICT (key) DO NOTHING;