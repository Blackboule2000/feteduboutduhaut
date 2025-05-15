/*
  # Ajout de la table des actualités

  1. Nouvelle Table
    - `news` : Gestion des actualités
      - `id` (uuid, clé primaire)
      - `title` (text, titre de l'actualité)
      - `date` (date, date de publication)
      - `description` (text, contenu de l'actualité)
      - `image_url` (text, URL de l'image)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Activation RLS
    - Politique d'accès pour les administrateurs
*/

CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les administrateurs peuvent tout faire sur news"
ON news FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();