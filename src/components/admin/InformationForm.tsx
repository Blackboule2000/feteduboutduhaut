import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';

interface InformationSettings {
  essential_info: {
    date: string;
    time: string;
    location: {
      address: string;
      postal_code: string;
      city: string;
    };
    parking: string;
    camping: {
      available: boolean;
      description: string;
    };
  };
  important_notes: string[];
  eco_friendly: {
    zero_waste: string[];
    local_sourcing: string[];
    green_initiatives: string[];
  };
  bike_stage: {
    title: string;
    description: string;
    main_image: string;
    secondary_image: string;
  };
  partners: {
    name: string;
    logo: string;
    website: string;
    active: boolean;
  }[];
}

const defaultSettings: InformationSettings = {
  essential_info: {
    date: '26 Juillet 2025',
    time: '11:00 - 02:30',
    location: {
      address: '2 rue du Bout du Haut',
      city: 'Lachapelle sous Gerberoy',
      postal_code: '60380'
    },
    parking: 'Parking gratuit à proximité',
    camping: {
      available: true,
      description: 'Camping gratuit sur place avec sanitaires et point d\'eau'
    }
  },
  important_notes: [
    'Entrée gratuite pour tous',
    'Restauration locale et buvette sur place',
    'Village associatif et artisanal',
    'Animations pour petits et grands',
    'Zone ombragée et espaces de repos',
    'Accessibilité PMR',
    'Animaux acceptés tenus en laisse',
    'Parking vélos sécurisé'
  ],
  eco_friendly: {
    zero_waste: [
      'Gobelets réutilisables consignés',
      'Tri sélectif avec points de collecte dédiés',
      'Vaisselle réutilisable consignée pour la restauration',
      'Sensibilisation au tri avec des bénévoles'
    ],
    local_sourcing: [
      'Producteurs et artisans locaux',
      'Bières artisanales de la région',
      'Restauration privilégiant les produits de saison',
      'Partenariats avec les commerces locaux'
    ],
    green_initiatives: [
      'Scène à vélos alimentée par énergie humaine',
      'Parking vélos sécurisé et gratuit',
      'Toilettes sèches et économie d\'eau'
    ]
  },
  bike_stage: {
    title: 'La Scène à Vélos',
    description: 'Cette année, la Fête du Bout du Haut innove et s\'engage en accueillant la Scène à Vélos ! Bien plus qu\'une simple scène, c\'est une véritable expérience interactive et respectueuse de l\'environnement qui vous attend.',
    main_image: 'https://www.asca-asso.com/wp-content/uploads/2022/05/la-scene-a-velo-1024x400.png',
    secondary_image: 'https://www.asca-asso.com/wp-content/uploads/2025/02/SDS96588-1024x683.webp'
  },
  partners: []
};

const InformationForm: React.FC = () => {
  const [settings, setSettings] = useState<InformationSettings>(defaultSettings);
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
        .eq('key', 'information_settings')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // If no data exists, create it with default settings
        const { error: upsertError } = await supabase
          .from('settings')
          .upsert({
            key: 'information_settings',
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
          key: 'information_settings',
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

  const handleArrayUpdate = (
    section: keyof typeof settings,
    subsection: string | null,
    index: number,
    value: string
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (subsection) {
        (newSettings[section] as any)[subsection][index] = value;
      } else {
        (newSettings[section] as string[])[index] = value;
      }
      return newSettings;
    });
  };

  const handleArrayAdd = (
    section: keyof typeof settings,
    subsection: string | null
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (subsection) {
        (newSettings[section] as any)[subsection].push('');
      } else {
        (newSettings[section] as string[]).push('');
      }
      return newSettings;
    });
  };

  const handleArrayRemove = (
    section: keyof typeof settings,
    subsection: string | null,
    index: number
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (subsection) {
        (newSettings[section] as any)[subsection].splice(index, 1);
      } else {
        (newSettings[section] as string[]).splice(index, 1);
      }
      return newSettings;
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
        <h3 className="text-lg font-bold text-yellow-900">Informations essentielles</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-yellow-700">Date</label>
            <input
              type="text"
              value={settings.essential_info.date}
              onChange={(e) => setSettings({
                ...settings,
                essential_info: { ...settings.essential_info, date: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-700">Horaires</label>
            <input
              type="text"
              value={settings.essential_info.time}
              onChange={(e) => setSettings({
                ...settings,
                essential_info: { ...settings.essential_info, time: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-yellow-800">Adresse</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-yellow-700">Rue</label>
              <input
                type="text"
                value={settings.essential_info.location.address}
                onChange={(e) => setSettings({
                  ...settings,
                  essential_info: {
                    ...settings.essential_info,
                    location: { ...settings.essential_info.location, address: e.target.value }
                  }
                })}
                className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-700">Ville</label>
              <input
                type="text"
                value={settings.essential_info.location.city}
                onChange={(e) => setSettings({
                  ...settings,
                  essential_info: {
                    ...settings.essential_info,
                    location: { ...settings.essential_info.location, city: e.target.value }
                  }
                })}
                className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-700">Code postal</label>
              <input
                type="text"
                value={settings.essential_info.location.postal_code}
                onChange={(e) => setSettings({
                  ...settings,
                  essential_info: {
                    ...settings.essential_info,
                    location: { ...settings.essential_info.location, postal_code: e.target.value }
                  }
                })}
                className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-700">Information parking</label>
          <input
            type="text"
            value={settings.essential_info.parking}
            onChange={(e) => setSettings({
              ...settings,
              essential_info: { ...settings.essential_info, parking: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.essential_info.camping.available}
              onChange={(e) => setSettings({
                ...settings,
                essential_info: {
                  ...settings.essential_info,
                  camping: { ...settings.essential_info.camping, available: e.target.checked }
                }
              })}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
            />
            <label className="ml-2 block text-sm text-yellow-700">
              Camping disponible
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-yellow-700">Description du camping</label>
            <textarea
              value={settings.essential_info.camping.description}
              onChange={(e) => setSettings({
                ...settings,
                essential_info: {
                  ...settings.essential_info,
                  camping: { ...settings.essential_info.camping, description: e.target.value }
                }
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-yellow-900">Notes importantes</h3>
        {settings.important_notes.map((note, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={note}
              onChange={(e) => handleArrayUpdate('important_notes', null, index, e.target.value)}
              className="flex-1 rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
            <button
              type="button"
              onClick={() => handleArrayRemove('important_notes', null, index)}
              className="text-red-600 hover:text-red-800"
            >
              Supprimer
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleArrayAdd('important_notes', null)}
          className="text-yellow-600 hover:text-yellow-800"
        >
          Ajouter une note
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-yellow-900">Initiatives écologiques</h3>
        
        <div className="space-y-4">
          <h4 className="text-md font-medium text-yellow-800">Zéro déchet</h4>
          {settings.eco_friendly.zero_waste.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayUpdate('eco_friendly', 'zero_waste', index, e.target.value)}
                className="flex-1 rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
              <button
                type="button"
                onClick={() => handleArrayRemove('eco_friendly', 'zero_waste', index)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayAdd('eco_friendly', 'zero_waste')}
            className="text-yellow-600 hover:text-yellow-800"
          >
            Ajouter une initiative zéro déchet
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-yellow-800">Circuit court & Local</h4>
          {settings.eco_friendly.local_sourcing.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayUpdate('eco_friendly', 'local_sourcing', index, e.target.value)}
                className="flex-1 rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
              <button
                type="button"
                onClick={() => handleArrayRemove('eco_friendly', 'local_sourcing', index)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayAdd('eco_friendly', 'local_sourcing')}
            className="text-yellow-600 hover:text-yellow-800"
          >
            Ajouter une initiative locale
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-yellow-800">Initiatives vertes</h4>
          {settings.eco_friendly.green_initiatives.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayUpdate('eco_friendly', 'green_initiatives', index, e.target.value)}
                className="flex-1 rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
              <button
                type="button"
                onClick={() => handleArrayRemove('eco_friendly', 'green_initiatives', index)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayAdd('eco_friendly', 'green_initiatives')}
            className="text-yellow-600 hover:text-yellow-800"
          >
            Ajouter une initiative verte
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-yellow-900">Scène à Vélos</h3>
        
        <div>
          <label className="block text-sm font-medium text-yellow-700">Titre</label>
          <input
            type="text"
            value={settings.bike_stage.title}
            onChange={(e) => setSettings({
              ...settings,
              bike_stage: { ...settings.bike_stage, title: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-700">Description</label>
          <textarea
            value={settings.bike_stage.description}
            onChange={(e) => setSettings({
              ...settings,
              bike_stage: { ...settings.bike_stage, description: e.target.value }
            })}
            rows={4}
            className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-700">Image principale</label>
          <input
            type="url"
            value={settings.bike_stage.main_image}
            onChange={(e) => setSettings({
              ...settings,
              bike_stage: { ...settings.bike_stage, main_image: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
          {settings.bike_stage.main_image && (
            <img
              src={settings.bike_stage.main_image}
              alt="Image principale de la scène à vélos"
              className="mt-2 max-h-40 rounded"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-700">Image secondaire</label>
          <input
            type="url"
            value={settings.bike_stage.secondary_image}
            onChange={(e) => setSettings({
              ...settings,
              bike_stage: { ...settings.bike_stage, secondary_image: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
          {settings.bike_stage.secondary_image && (
            <img
              src={settings.bike_stage.secondary_image}
              alt="Image secondaire de la scène à vélos"
              className="mt-2 max-h-40 rounded"
            />
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

export default InformationForm;