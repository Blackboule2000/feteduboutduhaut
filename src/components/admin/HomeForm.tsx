import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Upload } from 'lucide-react';
import { uploadMedia } from '../../lib/media';

interface HomeSettings {
  main_image: {
    url: string;
    alt: string;
  };
  poster: {
    url: string;
    alt: string;
  };
  countdown: {
    enabled: boolean;
    date: string;
    time: string;
  };
  birds: {
    enabled: boolean;
    quantity: number;
  };
}

const defaultSettings: HomeSettings = {
  main_image: {
    url: 'http://www.image-heberg.fr/files/1747215665990305646.png',
    alt: 'Logo Fête du Bout du Haut'
  },
  poster: {
    url: 'http://www.image-heberg.fr/files/17472124523185540990.jpg',
    alt: 'Affiche Fête du Bout du Haut 2025'
  },
  countdown: {
    enabled: true,
    date: '2025-07-26',
    time: '11:00'
  },
  birds: {
    enabled: true,
    quantity: 6
  }
};

const HomeForm: React.FC = () => {
  const [settings, setSettings] = useState<HomeSettings>(defaultSettings);
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
        .eq('key', 'home_settings')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { error: upsertError } = await supabase
          .from('settings')
          .upsert({
            key: 'home_settings',
            value: defaultSettings
          });

        if (upsertError) throw upsertError;
        setSettings(defaultSettings);
      } else {
        setSettings(data.value);
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
          key: 'home_settings',
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

  const handleImageUpload = async (file: File, type: 'main_image' | 'poster') => {
    try {
      const path = `home/${type}_${Date.now()}_${file.name}`;
      const url = await uploadMedia(file, path);
      
      setSettings(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          url: url
        }
      }));
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      setError('Erreur lors du téléchargement de l\'image');
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
        <h3 className="text-lg font-bold text-yellow-900">Image Principale</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              URL de l'image
            </label>
            <input
              type="url"
              value={settings.main_image.url}
              onChange={(e) => setSettings({
                ...settings,
                main_image: { ...settings.main_image, url: e.target.value }
              })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Texte alternatif
            </label>
            <input
              type="text"
              value={settings.main_image.alt}
              onChange={(e) => setSettings({
                ...settings,
                main_image: { ...settings.main_image, alt: e.target.value }
              })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {settings.main_image.url && (
            <img
              src={settings.main_image.url}
              alt="Aperçu de l'image principale"
              className="max-h-48 rounded-lg"
            />
          )}

          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'main_image');
              }}
              className="flex-1"
            />
            <Upload className="h-5 w-5 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-yellow-900">Affiche</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              URL de l'affiche
            </label>
            <input
              type="url"
              value={settings.poster.url}
              onChange={(e) => setSettings({
                ...settings,
                poster: { ...settings.poster, url: e.target.value }
              })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Texte alternatif
            </label>
            <input
              type="text"
              value={settings.poster.alt}
              onChange={(e) => setSettings({
                ...settings,
                poster: { ...settings.poster, alt: e.target.value }
              })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {settings.poster.url && (
            <img
              src={settings.poster.url}
              alt="Aperçu de l'affiche"
              className="max-h-48 rounded-lg"
            />
          )}

          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'poster');
              }}
              className="flex-1"
            />
            <Upload className="h-5 w-5 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-yellow-900">Compte à rebours</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.countdown.enabled}
              onChange={(e) => setSettings({
                ...settings,
                countdown: { ...settings.countdown, enabled: e.target.checked }
              })}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
            />
            <label className="ml-2 text-sm text-yellow-700">
              Activer le compte à rebours
            </label>
          </div>

          {settings.countdown.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={settings.countdown.date}
                  onChange={(e) => setSettings({
                    ...settings,
                    countdown: { ...settings.countdown, date: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-2">
                  Heure
                </label>
                <input
                  type="time"
                  value={settings.countdown.time}
                  onChange={(e) => setSettings({
                    ...settings,
                    countdown: { ...settings.countdown, time: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-yellow-900">Hirondelles</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.birds.enabled}
              onChange={(e) => setSettings({
                ...settings,
                birds: { ...settings.birds, enabled: e.target.checked }
              })}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
            />
            <label className="ml-2 text-sm text-yellow-700">
              Afficher les hirondelles
            </label>
          </div>

          {settings.birds.enabled && (
            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-2">
                Nombre d'hirondelles
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={settings.birds.quantity}
                onChange={(e) => setSettings({
                  ...settings,
                  birds: { ...settings.birds, quantity: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
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

export default HomeForm;