/*
  # Amélioration du suivi des statistiques

  1. Modifications de Tables
    - Ajout de colonnes à la table `stats`:
      - `user_agent` : Informations sur le navigateur
      - `referrer` : Site d'origine
      - `session_duration` : Durée de la visite
      - `country` : Pays d'origine
      - `region` : Région
      - `city` : Ville
*/

ALTER TABLE stats
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT,
ADD COLUMN IF NOT EXISTS session_duration INTEGER,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;