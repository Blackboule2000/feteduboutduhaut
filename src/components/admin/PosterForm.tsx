import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';

interface PosterSettings {
  image_url: string;
  alt_text: string;
  enabled: boolean;
}

const defaultSettings: PosterSettings = {
  image_url: 'http://www.image-heberg.fr/files/17472124523185540990.jpg',
  alt_text: 'Affiche Fête du Bout du Haut 2025',
  enabled: true
};

const PosterForm: React.FC = () => {
  const [settings, setSettings] = useState<PosterSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(defaultSettings.image_url);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Mettre à jour la prévisualisation quand l'URL change
    setPreview(settings.image_url);
  }, [settings.image_url]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'poster_settings')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Si aucune donnée n'existe, créer avec les paramètres par défaut
        const { error: upsertError } = await supabase
          .from('settings')
          .upsert({
            key: 'poster_settings',
            value: defaultSettings
          });

        if (upsertError) throw upsertError;
        setSettings(defaultSettings);
      } else {
        // Fusionner avec les paramètres par défaut pour s'assurer que toutes les propriétés existent
        setSettings({ ...defaultSettings, ...data.value });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
      setError('Erreur lors du chargement des paramètres');
    }
  };

  const validateImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok && response.headers.get('content-type')?.startsWith('image/');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Valider l'URL de l'image
      const isValidImage = await validateImageUrl(settings.image_url);
      if (!isValidImage) {
        throw new Error("L'URL fournie n'est pas une image valide");
      }

      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'poster_settings',
          value: settings
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setSettings({ ...settings, image_url: newUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          Paramètres enregistrés avec succès !
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            URL de l'affiche
          </label>
          <div className="space-y-4">
            <input
              type="url"
              value={settings.image_url}
              onChange={handleImageUrlChange}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="https://..."
              required
            />
            {preview && (
              <div className="relative aspect-[3/4] max-w-md mx-auto">
                <img
                  src={preview}
                  alt="Aperçu de l'affiche"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  onError={() => setPreview(defaultSettings.image_url)}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            Texte alternatif
          </label>
          <input
            type="text"
            value={settings.alt_text}
            onChange={(e) => setSettings({ ...settings, alt_text: e.target.value })}
            className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Description de l'affiche"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
          />
          <label className="ml-2 block text-sm text-yellow-700">
            Afficher l'affiche
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
};

export default PosterForm;