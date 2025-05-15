import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload } from 'lucide-react';
import { uploadMedia } from '../../lib/media';

interface HeroSettings {
  title: string;
  subtitle: string;
  date: string;
  main_image: string;
  poster_image: string;
  background_color: string;
  social_links: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  cta_button: {
    text: string;
    url: string;
    enabled: boolean;
  };
  countdown: {
    enabled: boolean;
    target_date: string;
    background_color: string;
  };
}

const defaultSettings: HeroSettings = {
  title: 'Fête du Bout du Haut',
  subtitle: 'Festival Musical et Culturel',
  date: '26 Juillet 2025',
  main_image: 'http://www.image-heberg.fr/files/1747215665990305646.png',
  poster_image: 'http://www.image-heberg.fr/files/17472124523185540990.jpg',
  background_color: '#f6d9a0',
  social_links: {
    facebook: 'https://www.facebook.com/AssociationDuBoutDuHaut',
    instagram: 'https://www.instagram.com/association_du_bout_du_haut',
    twitter: ''
  },
  cta_button: {
    text: 'Réserver maintenant',
    url: '#contact',
    enabled: false
  },
  countdown: {
    enabled: true,
    target_date: '2025-07-26T11:00:00',
    background_color: '#f6d9a0'
  }
};

const HeroForm: React.FC = () => {
  const [settings, setSettings] = useState<HeroSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState({
    main: false,
    poster: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'hero_settings')
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setSettings(data.value);
      } else {
        // Si aucune donnée n'existe, on crée les paramètres par défaut
        const { error: upsertError } = await supabase
          .from('settings')
          .upsert({
            key: 'hero_settings',
            value: defaultSettings
          });

        if (upsertError) throw upsertError;
        setSettings(defaultSettings);
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
          key: 'hero_settings',
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

  const handleImageUpload = async (file: File | null, type: 'main' | 'poster') => {
    if (!file) {
      setError('Aucun fichier sélectionné');
      return;
    }

    setError(null);
    setUploadLoading(prev => ({ ...prev, [type]: true }));

    try {
      const path = `hero/${type}_${Date.now()}_${file.name}`;
      const url = await uploadMedia(file, path);

      const newSettings = {
        ...settings,
        [type === 'main' ? 'main_image' : 'poster_image']: url
      };

      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'hero_settings',
          value: newSettings
        });

      if (error) throw error;

      setSettings(newSettings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement du fichier');
    } finally {
      setUploadLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            Titre principal
          </label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            Sous-titre
          </label>
          <input
            type="text"
            value={settings.subtitle}
            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
            className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            Date
          </label>
          <input
            type="text"
            value={settings.date}
            onChange={(e) => setSettings({ ...settings, date: e.target.value })}
            className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            Couleur de fond
          </label>
          <input
            type="color"
            value={settings.background_color}
            onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
            className="w-full h-10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            Image principale
          </label>
          <div className="space-y-4">
            <input
              type="url"
              value={settings.main_image}
              onChange={(e) => setSettings({ ...settings, main_image: e.target.value })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="https://..."
            />
            {settings.main_image && (
              <img
                src={settings.main_image}
                alt="Image principale"
                className="max-w-full h-auto rounded-lg"
              />
            )}
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  handleImageUpload(file, 'main');
                }}
                className="flex-1"
                disabled={uploadLoading.main}
              />
              {uploadLoading.main ? (
                <div className="animate-spin h-5 w-5 text-yellow-600">⌛</div>
              ) : (
                <Upload className="h-5 w-5 text-yellow-600" />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            Affiche
          </label>
          <div className="space-y-4">
            <input
              type="url"
              value={settings.poster_image}
              onChange={(e) => setSettings({ ...settings, poster_image: e.target.value })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="https://..."
            />
            {settings.poster_image && (
              <img
                src={settings.poster_image}
                alt="Affiche"
                className="max-w-full h-auto rounded-lg"
              />
            )}
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  handleImageUpload(file, 'poster');
                }}
                className="flex-1"
                disabled={uploadLoading.poster}
              />
              {uploadLoading.poster ? (
                <div className="animate-spin h-5 w-5 text-yellow-600">⌛</div>
              ) : (
                <Upload className="h-5 w-5 text-yellow-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-yellow-900">Réseaux sociaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              Facebook
            </label>
            <input
              type="url"
              value={settings.social_links.facebook}
              onChange={(e) => setSettings({
                ...settings,
                social_links: { 
                  ...settings.social_links,
                  facebook: e.target.value 
                }
              })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              Instagram
            </label>
            <input
              type="url"
              value={settings.social_links.instagram}
              onChange={(e) => setSettings({
                ...settings,
                social_links: { 
                  ...settings.social_links,
                  instagram: e.target.value 
                }
              })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-yellow-900">Bouton d'action</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.cta_button.enabled}
              onChange={(e) => setSettings({
                ...settings,
                cta_button: { 
                  ...settings.cta_button,
                  enabled: e.target.checked 
                }
              })}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
            />
            <label className="ml-2 block text-sm text-yellow-700">
              Afficher le bouton d'action
            </label>
          </div>
          {settings.cta_button.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Texte du bouton
                </label>
                <input
                  type="text"
                  value={settings.cta_button.text}
                  onChange={(e) => setSettings({
                    ...settings,
                    cta_button: { 
                      ...settings.cta_button,
                      text: e.target.value 
                    }
                  })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  URL du bouton
                </label>
                <input
                  type="text"
                  value={settings.cta_button.url}
                  onChange={(e) => setSettings({
                    ...settings,
                    cta_button: { 
                      ...settings.cta_button,
                      url: e.target.value 
                    }
                  })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-yellow-900">Compte à rebours</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.countdown.enabled}
              onChange={(e) => setSettings({
                ...settings,
                countdown: { 
                  ...settings.countdown,
                  enabled: e.target.checked 
                }
              })}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
            />
            <label className="ml-2 block text-sm text-yellow-700">
              Afficher le compte à rebours
            </label>
          </div>
          {settings.countdown.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Date et heure cible
                </label>
                <input
                  type="datetime-local"
                  value={settings.countdown.target_date}
                  onChange={(e) => setSettings({
                    ...settings,
                    countdown: { 
                      ...settings.countdown,
                      target_date: e.target.value 
                    }
                  })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Couleur de fond
                </label>
                <input
                  type="color"
                  value={settings.countdown.background_color}
                  onChange={(e) => setSettings({
                    ...settings,
                    countdown: { 
                      ...settings.countdown,
                      background_color: e.target.value 
                    }
                  })}
                  className="w-full h-10"
                />
              </div>
            </div>
          )}
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

export default HeroForm;