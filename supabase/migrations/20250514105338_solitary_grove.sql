/*
  # Ajout de l'URL d'image pour les activités

  1. Modifications de Tables
    - Ajout de la colonne `image_url` à la table `activities`

  2. Sécurité
    - Maintien des politiques existantes
*/

ALTER TABLE activities
ADD COLUMN IF NOT EXISTS image_url TEXT;