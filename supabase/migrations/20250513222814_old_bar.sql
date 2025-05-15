/*
  # Ajout de la gestion des médias pour les concerts

  1. Modifications de Tables
    - Ajout de colonnes à la table `concerts`:
      - `audio_url` : URL du fichier audio
      - `stage` : Scène sur laquelle le groupe joue

  2. Sécurité
    - Maintien des politiques existantes
*/

ALTER TABLE concerts
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS stage TEXT;