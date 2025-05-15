-- Création du bucket pour le stockage des médias
INSERT INTO storage.buckets (id, name)
VALUES ('media', 'media')
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre l'accès public en lecture
CREATE POLICY "Media files are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Politique pour permettre l'upload par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Politique pour permettre la modification par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

-- Politique pour permettre la suppression par les utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');