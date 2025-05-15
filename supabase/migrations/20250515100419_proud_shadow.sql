DO $$ 
BEGIN
  -- News table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'news' 
    AND policyname = 'Permettre la lecture publique des actualités'
  ) THEN
    CREATE POLICY "Permettre la lecture publique des actualités"
    ON news FOR SELECT
    TO public
    USING (true);
  END IF;

  -- Concerts table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'concerts' 
    AND policyname = 'Permettre la lecture publique des concerts'
  ) THEN
    CREATE POLICY "Permettre la lecture publique des concerts"
    ON concerts FOR SELECT
    TO public
    USING (true);
  END IF;

  -- Activities table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'activities' 
    AND policyname = 'Permettre la lecture publique des activités'
  ) THEN
    CREATE POLICY "Permettre la lecture publique des activités"
    ON activities FOR SELECT
    TO public
    USING (true);
  END IF;

  -- Settings table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'settings' 
    AND policyname = 'Permettre la lecture publique des paramètres'
  ) THEN
    CREATE POLICY "Permettre la lecture publique des paramètres"
    ON settings FOR SELECT
    TO public
    USING (true);
  END IF;

  -- Partners table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'partners' 
    AND policyname = 'Permettre la lecture publique des partenaires'
  ) THEN
    CREATE POLICY "Permettre la lecture publique des partenaires"
    ON partners FOR SELECT
    TO public
    USING (true);
  END IF;

  -- Program table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'program' 
    AND policyname = 'Permettre la lecture publique du programme'
  ) THEN
    CREATE POLICY "Permettre la lecture publique du programme"
    ON program FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;