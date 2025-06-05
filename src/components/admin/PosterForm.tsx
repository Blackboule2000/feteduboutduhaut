import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';

interface PosterSettings {
  image_url: string;
  alt_text: string;
  enabled: boolean;
}

const defaultSettings: PosterSettings = {
  image_url: "https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-6/502629123_707713045290812_7175619882336714234_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=75d36f&_nc_ohc=2Rf81NCHIMAQ7kNvwG95lyY&_nc_oc=Adl9OC8ECn77F9Z-o1lF-_L10As3OEdx0GMUNP2e3Tiav_WG-nNlQqjPzUG4mfQ3iEjwdHjCcqvBSNHA9Tf9_Zbg&_nc_zt=23&_nc_ht=scontent.fcdg3-1.fna&_nc_gid=kWu5DM0-FeRj-iEzd4Fq6A&oh=00_AfMjxAQyaXi5ImzqhUeILQ3vgSooAWET0F6YrFNI5lBBQA&oe=6847336D",
  alt_text: 'Affiche Fête du Bout du Haut 2025',
  enabled: true
};

const PosterForm: React.FC = () => {
  const [settings, setSettings] = useState<PosterSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'poster_settings')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { error: upsertError } = await supabase
          .from('settings')
          .upsert({
            key: 'poster_settings',
            value: defaultSettings
          });

        if (upsertError) throw upsertError;
        setSettings(defaultSettings);
      } else {
        setSettings({ ...defaultSettings, ...data.value });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
      setError('Erreur lors du chargement des paramètres');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
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
      setError('Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setLoading(false);
    }
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
              onChange={(e) => setSettings({ ...settings, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="https://..."
              required
            />
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              <img
                src={settings.image_url}
                alt="Aperçu de l'affiche"
                className="w-full h-full object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultSettings.image_url;
                }}
              />
            </div>
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