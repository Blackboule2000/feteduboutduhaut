import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';

interface CustomizationSettings {
  site_colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  site_fonts: {
    title: string;
    body: string;
  };
  festival_info: {
    name: string;
    date: string;
    location: string;
  };
  contact_info: {
    email: string;
    phone: string;
  };
  social_media: {
    facebook: string;
    instagram: string;
  };
}

const defaultSettings: CustomizationSettings = {
  site_colors: {
    primary: '#ca5231',
    secondary: '#f6d9a0',
    accent: '#365d66'
  },
  site_fonts: {
    title: 'Swiss 721 Black Extended BT',
    body: 'Rainy Days'
  },
  festival_info: {
    name: 'Fête du Bout du Haut',
    date: '2025-07-26',
    location: 'Lachapelle sous Gerberoy'
  },
  contact_info: {
    email: 'association.boutduhaut@gmail.com',
    phone: '+33623456789'
  },
  social_media: {
    facebook: 'https://www.facebook.com/AssociationDuBoutDuHaut',
    instagram: 'https://www.instagram.com/association_du_bout_du_haut'
  }
};

const CustomizationForm: React.FC = () => {
  const [settings, setSettings] = useState<CustomizationSettings>(defaultSettings);
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
        .eq('key', 'customization_settings')
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        // Merge existing settings with defaults to ensure all properties exist
        setSettings({ ...defaultSettings, ...data.value });
      } else {
        // If no settings exist, create them with defaults
        const { error: upsertError } = await supabase
          .from('settings')
          .upsert({
            key: 'customization_settings',
            value: defaultSettings
          }, {
            onConflict: 'key'
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
          key: 'customization_settings',
          value: settings
        }, {
          onConflict: 'key'
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-yellow-900">Couleurs du site</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-700">
                Couleur principale
              </label>
              <input
                type="color"
                value={settings.site_colors.primary}
                onChange={(e) => setSettings({
                  ...settings,
                  site_colors: { ...settings.site_colors, primary: e.target.value }
                })}
                className="h-10 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-700">
                Couleur secondaire
              </label>
              <input
                type="color"
                value={settings.site_colors.secondary}
                onChange={(e) => setSettings({
                  ...settings,
                  site_colors: { ...settings.site_colors, secondary: e.target.value }
                })}
                className="h-10 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-700">
                Couleur d'accent
              </label>
              <input
                type="color"
                value={settings.site_colors.accent}
                onChange={(e) => setSettings({
                  ...settings,
                  site_colors: { ...settings.site_colors, accent: e.target.value }
                })}
                className="h-10 w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-yellow-900">Informations du festival</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-700">
                Nom du festival
              </label>
              <input
                type="text"
                value={settings.festival_info.name}
                onChange={(e) => setSettings({
                  ...settings,
                  festival_info: { ...settings.festival_info, name: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-700">
                Date
              </label>
              <input
                type="date"
                value={settings.festival_info.date}
                onChange={(e) => setSettings({
                  ...settings,
                  festival_info: { ...settings.festival_info, date: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-700">
                Lieu
              </label>
              <input
                type="text"
                value={settings.festival_info.location}
                onChange={(e) => setSettings({
                  ...settings,
                  festival_info: { ...settings.festival_info, location: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-yellow-900">Contact</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-700">
                Email
              </label>
              <input
                type="email"
                value={settings.contact_info.email}
                onChange={(e) => setSettings({
                  ...settings,
                  contact_info: { ...settings.contact_info, email: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-700">
                Téléphone
              </label>
              <input
                type="tel"
                value={settings.contact_info.phone}
                onChange={(e) => setSettings({
                  ...settings,
                  contact_info: { ...settings.contact_info, phone: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-yellow-900">Réseaux sociaux</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-700">
                Facebook
              </label>
              <input
                type="url"
                value={settings.social_media.facebook}
                onChange={(e) => setSettings({
                  ...settings,
                  social_media: { ...settings.social_media, facebook: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-700">
                Instagram
              </label>
              <input
                type="url"
                value={settings.social_media.instagram}
                onChange={(e) => setSettings({
                  ...settings,
                  social_media: { ...settings.social_media, instagram: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
          </div>
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

export default CustomizationForm;