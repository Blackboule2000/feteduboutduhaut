/*
  # Création de la table programme

  1. Nouvelle Table
    - `program` : Gestion du programme du festival
      - `id` (uuid, clé primaire)
      - `time` (text, horaire)
      - `title` (text, titre de l'événement)
      - `description` (text, description)
      - `stage` (text, scène)
      - `order_index` (integer, ordre d'affichage)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Activation RLS
    - Politique d'accès pour les administrateurs
*/

-- Vérifier si la table existe déjà
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'program'
  ) THEN
    -- Créer la table programme
    CREATE TABLE program (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      time TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      stage TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- Activer RLS
    ALTER TABLE program ENABLE ROW LEVEL SECURITY;

    -- Créer la politique pour les utilisateurs authentifiés
    CREATE POLICY "Les administrateurs peuvent tout faire sur program"
    ON program FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

    -- Créer le trigger pour updated_at
    CREATE TRIGGER update_program_updated_at
        BEFORE UPDATE ON program
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;