/*
  # Ajout des coordonnées géographiques

  1. Modifications de Tables
    - Ajout des colonnes latitude et longitude à la table `stats`
    - Ces colonnes stockeront les coordonnées précises des visiteurs
*/

ALTER TABLE stats
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;