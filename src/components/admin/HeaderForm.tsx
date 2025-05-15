import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Plus, Trash2, X } from 'lucide-react';

interface HeaderSettings {
  logo: {
    image_url: string;
    alt_text: string;
    link_url: string;
  };
  title: {
    text: string;
    font_family: string;
    color: string;
  };
  navigation: Array<{
    text: string;
    link: string;
    icon: string | null;
  }>;
  decorative_elements: {
    show_birds: boolean;
    show_windmill: boolean;
    bird_image_url: string;
    windmill_image_url: string;
  };
  styles: {
    background_color: string;
    text_color: string;
    hover_color: string;
    shadow_enabled: boolean;
    sticky_enabled: boolean;
  };
}

const defaultSettings: HeaderSettings = {
  logo: {
    image_url: 'https://i.ibb.co/652PBzS/logo-f-te-du-bout-du-haut-2.png',
    alt_text: 'Logo Fête du Bout du Haut',
    link_url: '/'
  },
  title: {
    text: 'FÊTE DU BOUT DU HAUT',
    font_family: 'Swiss 721 Black Extended BT',
    color: '#ca5231'
  },
  navigation: [
    { text: 'ACCUEIL', link: '/', icon: null },
    { text: 'ACTUALITÉS', link: '/actualites', icon: null },
    { text: 'PROGRAMME', link: '/programme', icon: null },
    { text: 'ACTIVITÉS', link: '/activites', icon: null },
    { text: 'INFORMATIONS', link: '/infos', icon: null },
    { text: 'CONTACT', link: '/contact', icon: null }
  ],
  decorative_elements: {
    show_birds: true,
    show_windmill: true,
    bird_image_url: 'http://www.image-heberg.fr/files/17472137482209719273.png',
    windmill_image_url: 'https://i.ibb.co/SwjYfyNK/olienne.png'
  },
  styles: {
    background_color: '#f6d9a0',
    text_color: '#ca5231',
    hover_color: '#365d66',
    shadow_enabled: true,
    sticky_enabled: true
  }
};

const HeaderForm: React.FC = () => {
  const [settings, setSettings] = useState<HeaderSettings>(defaultSettings);
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
        .eq('key', 'header_settings')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // If no data exists, create it with default settings
        const { error: upsertError } = await supabase
          .from('settings')
          .upsert({
            key: 'header_settings',
            value: defaultSettings
          });

        if (upsertError) throw upsertError;
        setSettings(defaultSettings);
      } else if (data?.value) {
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
          key: 'header_settings',
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

  const handleLogoUpload = async (file: File) => {
    try {
      const path = `header/logo_${Date.now()}_${file.name}`;
      const url = await uploadMedia(file, path);
      setSettings({
        ...settings,
        logo: { ...settings.logo, image_url: url }
      });
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      setError('Erreur lors de l\'upload du logo');
    }
  };

  const handleImageUpload = async (file: File, type: 'bird' | 'windmill') => {
    try {
      const path = `header/${type}_${Date.now()}_${file.name}`;
      const url = await uploadMedia(file, path);
      setSettings({
        ...settings,
        decorative_elements: {
          ...settings.decorative_elements,
          [type === 'bird' ? 'bird_image_url' : 'windmill_image_url']: url
        }
      });
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      setError(`Erreur lors de l'upload de l'image ${type}`);
    }
  };

  const addNavigationItem = () => {
    setSettings({
      ...settings,
      navigation: [
        ...settings.navigation,
        { text: '', link: '', icon: null }
      ]
    });
  };

  const removeNavigationItem = (index: number) => {
    const newNavigation = [...settings.navigation];
    newNavigation.splice(index, 1);
    setSettings({
      ...settings,
      navigation: newNavigation
    });
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
        <h3 className="text-lg font-bold text-yellow-900">Logo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              URL du logo
            </label>
            <input
              type="url"
              value={settings.logo.image_url}
              onChange={(e) => setSettings({
                ...settings,
                logo: { ...settings.logo, image_url: e.target.value }
              })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md"
              placeholder="https://exemple.com/logo.png"
            />
            {settings.logo.image_url && (
              <img
                src={settings.logo.image_url}
                alt="Logo actuel"
                className="h-20 mt-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Texte alternatif
            </label>
            <input
              type="text"
              value={settings.logo.alt_text}
              onChange={(e) => setSettings({
                ...settings,
                logo: { ...settings.logo, alt_text: e.target.value }
              })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-yellow-900">Titre</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Texte du titre
            </label>
            <input
              type="text"
              value={settings.title.text}
              onChange={(e) => setSettings({
                ...settings,
                title: { ...settings.title, text: e.target.value }
              })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Couleur du titre
            </label>
            <input
              type="color"
              value={settings.title.color}
              onChange={(e) => setSettings({
                ...settings,
                title: { ...settings.title, color: e.target.value }
              })}
              className="w-full h-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-yellow-900">Navigation</h3>
          <button
            type="button"
            onClick={addNavigationItem}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {settings.navigation.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <input
                type="text"
                value={item.text}
                onChange={(e) => {
                  const newNavigation = [...settings.navigation];
                  newNavigation[index] = { ...item, text: e.target.value };
                  setSettings({ ...settings, navigation: newNavigation });
                }}
                placeholder="Texte du lien"
                className="flex-1 px-4 py-2 border border-yellow-300 rounded-md"
              />
              <input
                type="url"
                value={item.link}
                onChange={(e) => {
                  const newNavigation = [...settings.navigation];
                  newNavigation[index] = { ...item, link: e.target.value };
                  setSettings({ ...settings, navigation: newNavigation });
                }}
                placeholder="URL du lien"
                className="flex-1 px-4 py-2 border border-yellow-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeNavigationItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-yellow-900">Éléments décoratifs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={settings.decorative_elements.show_birds}
                onChange={(e) => setSettings({
                  ...settings,
                  decorative_elements: {
                    ...settings.decorative_elements,
                    show_birds: e.target.checked
                  }
                })}
                className="h-4 w-4 text-yellow-600"
              />
              <label className="ml-2 text-sm text-yellow-700">
                Afficher les hirondelles
              </label>
            </div>
            {settings.decorative_elements.show_birds && (
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-2">
                  URL des hirondelles
                </label>
                <input
                  type="url"
                  value={settings.decorative_elements.bird_image_url}
                  onChange={(e) => setSettings({
                    ...settings,
                    decorative_elements: {
                      ...settings.decorative_elements,
                      bird_image_url: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md"
                  placeholder="https://exemple.com/hirondelle.png"
                />
                {settings.decorative_elements.bird_image_url && (
                  <img
                    src={settings.decorative_elements.bird_image_url}
                    alt="Hirondelle"
                    className="h-12 mt-2"
                  />
                )}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={settings.decorative_elements.show_windmill}
                onChange={(e) => setSettings({
                  ...settings,
                  decorative_elements: {
                    ...settings.decorative_elements,
                    show_windmill: e.target.checked
                  }
                })}
                className="h-4 w-4 text-yellow-600"
              />
              <label className="ml-2 text-sm text-yellow-700">
                Afficher l'éolienne
              </label>
            </div>
            {settings.decorative_elements.show_windmill && (
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-2">
                  URL de l'éolienne
                </label>
                <input
                  type="url"
                  value={settings.decorative_elements.windmill_image_url}
                  onChange={(e) => setSettings({
                    ...settings,
                    decorative_elements: {
                      ...settings.decorative_elements,
                      windmill_image_url: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md"
                  placeholder="https://exemple.com/eolienne.png"
                />
                {settings.decorative_elements.windmill_image_url && (
                  <img
                    src={settings.decorative_elements.windmill_image_url}
                    alt="Éolienne"
                    className="h-12 mt-2"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-yellow-900">Styles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Couleur de fond
            </label>
            <input
              type="color"
              value={settings.styles.background_color}
              onChange={(e) => setSettings({
                ...settings,
                styles: { ...settings.styles, background_color: e.target.value }
              })}
              className="w-full h-10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Couleur du texte
            </label>
            <input
              type="color"
              value={settings.styles.text_color}
              onChange={(e) => setSettings({
                ...settings,
                styles: { ...settings.styles, text_color: e.target.value }
              })}
              className="w-full h-10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Couleur au survol
            </label>
            <input
              type="color"
              value={settings.styles.hover_color}
              onChange={(e) => setSettings({
                ...settings,
                styles: { ...settings.styles, hover_color: e.target.value }
              })}
              className="w-full h-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.styles.shadow_enabled}
              onChange={(e) => setSettings({
                ...settings,
                styles: { ...settings.styles, shadow_enabled: e.target.checked }
              })}
              className="h-4 w-4 text-yellow-600"
            />
            <label className="ml-2 text-sm text-yellow-700">
              Activer l'ombre
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.styles.sticky_enabled}
              onChange={(e) => setSettings({
                ...settings,
                styles: { ...settings.styles, sticky_enabled: e.target.checked }
              })}
              className="h-4 w-4 text-yellow-600"
            />
            <label className="ml-2 text-sm text-yellow-700">
              Bandeau fixe au défilement
            </label>
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

export default HeaderForm;