/*
  # Création de la table des messages de contact

  1. Nouvelle Table
    - `contact_messages` : Stockage des messages de contact
      - `id` (uuid, clé primaire)
      - `name` (text, nom de l'expéditeur)
      - `email` (text, email de l'expéditeur)
      - `message` (text, contenu du message)
      - `created_at` (timestamp)
      - `read` (boolean, statut de lecture)

  2. Sécurité
    - Activation RLS
    - Politique d'accès pour les administrateurs
    - Politique d'insertion pour le public
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  read BOOLEAN DEFAULT false
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique
CREATE POLICY "Permettre l'insertion publique"
ON contact_messages FOR INSERT
TO public
WITH CHECK (true);

-- Politique pour les administrateurs
CREATE POLICY "Les administrateurs peuvent tout faire"
ON contact_messages FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);