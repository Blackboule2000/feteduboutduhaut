-- Politique pour la lecture publique des actualités
CREATE POLICY "Permettre la lecture publique des actualités"
ON news FOR SELECT
TO public
USING (true);

-- Politique pour la lecture publique des concerts
CREATE POLICY "Permettre la lecture publique des concerts"
ON concerts FOR SELECT
TO public
USING (true);

-- Politique pour la lecture publique des activités
CREATE POLICY "Permettre la lecture publique des activités"
ON activities FOR SELECT
TO public
USING (true);

-- Politique pour la lecture publique des paramètres
CREATE POLICY "Permettre la lecture publique des paramètres"
ON settings FOR SELECT
TO public
USING (true);

-- Politique pour la lecture publique des partenaires
CREATE POLICY "Permettre la lecture publique des partenaires"
ON partners FOR SELECT
TO public
USING (true);

-- Politique pour la lecture publique du programme
CREATE POLICY "Permettre la lecture publique du programme"
ON program FOR SELECT
TO public
USING (true);