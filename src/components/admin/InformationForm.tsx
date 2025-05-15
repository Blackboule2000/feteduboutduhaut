import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Plus, Trash2, ArrowRight } from 'lucide-react';

interface InformationSettings {
  essential_info: {
    items: Array<{
      title: string;
      text: string;
      icon: string;
    }>;
    camping: {
      enabled: boolean;
      title: string;
      description: string;
      details: string;
      image_url: string;
    };
  };
  important_notes: string[];
  eco_initiatives: Array<{
    title: string;
    icon: string;
    items: string[];
  }>;
  bike_stage: {
    title: string;
    description: string;
    main_image: string;
    secondary_image: string;
    features: string[];
    participation_title: string;
    participation_text: string;
  };
}

const defaultSettings: InformationSettings = {
  essential_info: {
    items: [
      { title: 'Date', text: 'Samedi 26 Juillet 2025', icon: 'Calendar' },
      { title: 'Horaires', text: 'De 11h00 à 02h30 du matin', icon: 'Clock' },
      { title: 'Lieu', text: '2 rue du Bout du Haut, 60380 Lachapelle sous Gerberoy', icon: 'MapPin' },
      { title: 'Concerts', text: '5 concerts sur 2 scènes', icon: 'Music' },
      { title: 'Bar & Food', text: 'Buvette et restauration sur place', icon: 'Beer' },
      { title: 'Village', text: 'Artisans et producteurs locaux', icon: 'ShoppingBag' }
    ],
    camping: {
      enabled: true,
      title: 'Camping Festival',
      description: 'Camping gratuit sur place',
      details: 'Espace aménagé avec sanitaires et point d\'eau',
      image_url: 'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg'
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
  eco_initiatives: [
    {
      title: 'Zéro déchet',
      icon: 'Recycle',
      items: [
        'Gobelets réutilisables consignés',
        'Tri sélectif avec points de collecte dédiés',
        'Vaisselle réutilisable consignée pour la restauration',
        'Sensibilisation au tri avec des bénévoles'
      ]
    },
    {
      title: 'Circuit court & Local',
      icon: 'Truck',
      items: [
        'Producteurs et artisans locaux',
        'Bières artisanales de la région',
        'Restauration privilégiant les produits de saison',
        'Partenariats avec les commerces locaux'
      ]
    },
    {
      title: 'Initiatives vertes',
      icon: 'Leaf',
      items: [
        'Scène à vélos alimentée par énergie humaine',
        'Parking vélos sécurisé et gratuit',
        'Toilettes sèches et économie d\'eau'
      ]
    }
  ],
  bike_stage: {
    title: 'La Scène à Vélos',
    description: 'Cette année, la Fête du Bout du Haut innove et s\'engage en accueillant la Scène à Vélos ! Bien plus qu\'une simple scène, c\'est une véritable expérience interactive et respectueuse de l\'environnement qui vous attend.',
    main_image: 'https://www.asca-asso.com/wp-content/uploads/2022/05/la-scene-a-velo-1024x400.png',
    secondary_image: 'https://www.asca-asso.com/wp-content/uploads/2025/02/SDS96588-1024x683.webp',
    features: ['7 vélogénérateurs', '2 panneaux solaires', '100% énergie verte'],
    participation_title: 'Participez à l\'expérience',
    participation_text: 'Et le plus beau ? Vous, spectateurs et spectatrices de la Fête du Bout du Haut, êtes invité.e.s à devenir acteurs de cette production d\'énergie ! Avant les concerts, participez à des actions ludiques de sensibilisation à la maîtrise de l\'énergie en pédalant. Et pendant les concerts, continuez à faire vivre la scène par votre énergie collective !'
  }
};

const InformationForm: React.FC = () => {
  const [settings, setSettings] = useState<InformationSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('essential');

  const iconOptions = [
    'Calendar', 'Clock', 'MapPin', 'Music', 'Beer', 'ShoppingBag',
    'Tent', 'Users', 'Leaf', 'Recycle', 'Truck'
  ];

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
        const { error: insertError } = await supabase
          .from('settings')
          .insert({
            key: 'information_settings',
            value: defaultSettings
          });

        if (insertError) throw insertError;
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

  const addEssentialInfoItem = () => {
    setSettings(prev => ({
      ...prev,
      essential_info: {
        ...prev.essential_info,
        items: [
          ...prev.essential_info.items,
          { title: '', text: '', icon: 'Info' }
        ]
      }
    }));
  };

  const removeEssentialInfoItem = (index: number) => {
    setSettings(prev => ({
      ...prev,
      essential_info: {
        ...prev.essential_info,
        items: prev.essential_info.items.filter((_, i) => i !== index)
      }
    }));
  };

  const addImportantNote = () => {
    setSettings(prev => ({
      ...prev,
      important_notes: [...prev.important_notes, '']
    }));
  };

  const removeImportantNote = (index: number) => {
    setSettings(prev => ({
      ...prev,
      important_notes: prev.important_notes.filter((_, i) => i !== index)
    }));
  };

  const addEcoInitiative = () => {
    setSettings(prev => ({
      ...prev,
      eco_initiatives: [
        ...prev.eco_initiatives,
        { title: '', icon: 'Leaf', items: [] }
      ]
    }));
  };

  const removeEcoInitiative = (index: number) => {
    setSettings(prev => ({
      ...prev,
      eco_initiatives: prev.eco_initiatives.filter((_, i) => i !== index)
    }));
  };

  const addEcoInitiativeItem = (initiativeIndex: number) => {
    setSettings(prev => ({
      ...prev,
      eco_initiatives: prev.eco_initiatives.map((initiative, index) => 
        index === initiativeIndex
          ? { ...initiative, items: [...initiative.items, ''] }
          : initiative
      )
    }));
  };

  const removeEcoInitiativeItem = (initiativeIndex: number, itemIndex: number) => {
    setSettings(prev => ({
      ...prev,
      eco_initiatives: prev.eco_initiatives.map((initiative, index) => 
        index === initiativeIndex
          ? { ...initiative, items: initiative.items.filter((_, i) => i !== itemIndex) }
          : initiative
      )
    }));
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

      <div className="flex space-x-4 border-b border-yellow-200">
        {['essential', 'notes', 'eco', 'bike'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === tab
                ? 'border-b-2 border-yellow-500 text-yellow-600'
                : 'text-yellow-500 hover:text-yellow-700'
            }`}
          >
            {tab === 'essential' && 'Informations Essentielles'}
            {tab === 'notes' && 'Notes Importantes'}
            {tab === 'eco' && 'Initiatives Écologiques'}
            {tab === 'bike' && 'Scène à Vélos'}
          </button>
        ))}
      </div>

      {activeTab === 'essential' && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-yellow-900">Informations essentielles</h3>
              <button
                type="button"
                onClick={addEssentialInfoItem}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {settings.essential_info.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <select
                    value={item.icon}
                    onChange={(e) => {
                      const newItems = [...settings.essential_info.items];
                      newItems[index] = { ...item, icon: e.target.value };
                      setSettings({
                        ...settings,
                        essential_info: { ...settings.essential_info, items: newItems }
                      });
                    }}
                    className="w-32 px-3 py-2 border border-yellow-300 rounded-md"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...settings.essential_info.items];
                      newItems[index] = { ...item, title: e.target.value };
                      setSettings({
                        ...settings,
                        essential_info: { ...settings.essential_info, items: newItems }
                      });
                    }}
                    placeholder="Titre"
                    className="flex-1 px-3 py-2 border border-yellow-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const newItems = [...settings.essential_info.items];
                      newItems[index] = { ...item, text: e.target.value };
                      setSettings({
                        ...settings,
                        essential_info: { ...settings.essential_info, items: newItems }
                      });
                    }}
                    placeholder="Texte"
                    className="flex-1 px-3 py-2 border border-yellow-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeEssentialInfoItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-yellow-900 mb-4">Camping</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.essential_info.camping.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    essential_info: {
                      ...settings.essential_info,
                      camping: {
                        ...settings.essential_info.camping,
                        enabled: e.target.checked
                      }
                    }
                  })}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
                />
                <label className="ml-2 block text-sm text-yellow-700">
                  Activer la section camping
                </label>
              </div>

              {settings.essential_info.camping.enabled && (
                <div className="space-y-4 pl-6">
                  <input
                    type="text"
                    value={settings.essential_info.camping.title}
                    onChange={(e) => setSettings({
                      ...settings,
                      essential_info: {
                        ...settings.essential_info,
                        camping: {
                          ...settings.essential_info.camping,
                          title: e.target.value
                        }
                      }
                    })}
                    placeholder="Titre"
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={settings.essential_info.camping.description}
                    onChange={(e) => setSettings({
                      ...settings,
                      essential_info: {
                        ...settings.essential_info,
                        camping: {
                          ...settings.essential_info.camping,
                          description: e.target.value
                        }
                      }
                    })}
                    placeholder="Description"
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={settings.essential_info.camping.details}
                    onChange={(e) => setSettings({
                      ...settings,
                      essential_info: {
                        ...settings.essential_info,
                        camping: {
                          ...settings.essential_info.camping,
                          details: e.target.value
                        }
                      }
                    })}
                    placeholder="Détails"
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md"
                  />
                  <input
                    type="url"
                    value={settings.essential_info.camping.image_url}
                    onChange={(e) => setSettings({
                      ...settings,
                      essential_info: {
                        ...settings.essential_info,
                        camping: {
                          ...settings.essential_info.camping,
                          image_url: e.target.value
                        }
                      }
                    })}
                    placeholder="URL de l'image"
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md"
                  />
                  {settings.essential_info.camping.image_url && (
                    <img
                      src={settings.essential_info.camping.image_url}
                      alt="Aperçu camping"
                      className="max-h-40 rounded-md"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-yellow-900">Notes importantes</h3>
            <button
              type="button"
              onClick={addImportantNote}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            {settings.important_notes.map((note, index) => (
              <div key={index} className="flex items-center gap-4">
                <ArrowRight className="h-5 w-5 text-yellow-600" />
                <input
                  type="text"
                  value={note}
                  onChange={(e) => {
                    const newNotes = [...settings.important_notes];
                    newNotes[index] = e.target.value;
                    setSettings({ ...settings, important_notes: newNotes });
                  }}
                  className="flex-1 px-3 py-2 border border-yellow-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImportantNote(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'eco' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-yellow-900">Initiatives écologiques</h3>
            <button
              type="button"
              onClick={addEcoInitiative}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-8">
            {settings.eco_initiatives.map((initiative, initiativeIndex) => (
              <div key={initiativeIndex} className="border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <select
                    value={initiative.icon}
                    onChange={(e) => {
                      const newInitiatives = [...settings.eco_initiatives];
                      newInitiatives[initiativeIndex] = {
                        ...initiative,
                        icon: e.target.value
                      };
                      setSettings({ ...settings, eco_initiatives: newInitiatives });
                    }}
                    className="w-32 px-3 py-2 border border-yellow-300 rounded-md"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={initiative.title}
                    onChange={(e) => {
                      const newInitiatives = [...settings.eco_initiatives];
                      newInitiatives[initiativeIndex] = {
                        ...initiative,
                        title: e.target.value
                      };
                      setSettings({ ...settings, eco_initiatives: newInitiatives });
                    }}
                    placeholder="Titre de l'initiative"
                    className="flex-1 px-3 py-2 border border-yellow-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeEcoInitiative(initiativeIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="pl-6 space-y-4">
                  {initiative.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-4">
                      <ArrowRight className="h-5 w-5 text-yellow-600" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newInitiatives = [...settings.eco_initiatives];
                          newInitiatives[initiativeIndex].items[itemIndex] = e.target.value;
                          setSettings({ ...settings, eco_initiatives: newInitiatives });
                        }}
                        className="flex-1 px-3 py-2 border border-yellow-300 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeEcoInitiativeItem(initiativeIndex, itemIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addEcoInitiativeItem(initiativeIndex)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bike' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-yellow-900">Scène à Vélos</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                value={settings.bike_stage.title}
                onChange={(e) => setSettings({
                  ...settings,
                  bike_stage: { ...settings.bike_stage, title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-yellow-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-1">
                Description
              </label>
              <textarea
                value={settings.bike_stage.description}
                onChange={(e) => setSettings({
                  ...settings,
                  bike_stage: { ...settings.bike_stage, description: e.target.value }
                })}
                rows={4}
                className="w-full px-3 py-2 border border-yellow-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-1">
                Image principale
              </label>
              <input
                type="url"
                value={settings.bike_stage.main_image}
                onChange={(e) => setSettings({
                  ...settings,
                  bike_stage: { ...settings.bike_stage, main_image: e.target.value }
                })}
                className="w-full px-3 py-2 border border-yellow-300 rounded-md"
              />
              {settings.bike_stage.main_image && (
                <img
                  src={settings.bike_stage.main_image}
                  alt="Image principale"
                  className="mt-2 max-h-40 rounded-md"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-1">
                Image secondaire
              </label>
              <input
                type="url"
                value={settings.bike_stage.secondary_image}
                onChange={(e) => setSettings({
                  ...settings,
                  bike_stage: { ...settings.bike_stage, secondary_image: e.target.value }
                })}
                className="w-full px-3 py-2 border border-yellow-300 rounded-md"
              />
              {settings.bike_stage.secondary_image && (
                <img
                  src={settings.bike_stage.secondary_image}
                  alt="Image secondaire"
                  className="mt-2 max-h-40 rounded-md"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-1">
                Caractéristiques
              </label>
              <div className="space-y-2">
                {settings.bike_stage.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...settings.bike_stage.features];
                        newFeatures[index] = e.target.value;
                        setSettings({
                          ...settings,
                          bike_stage: { ...settings.bike_stage, features: newFeatures }
                        });
                      }}
                      className="flex-1 px-3 py-2 border border-yellow-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFeatures = settings.bike_stage.features.filter((_, i) => i !== index);
                        setSettings({
                          ...settings,
                          bike_stage: { ...settings.bike_stage, features: newFeatures }
                        });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      bike_stage: {
                        ...settings.bike_stage,
                        features: [...settings.bike_stage.features, '']
                      }
                    });
                  }}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-1">
                Titre de la participation
              </label>
              <input
                type="text"
                value={settings.bike_stage.participation_title}
                onChange={(e) => setSettings({
                  ...settings,
                  bike_stage: { ...settings.bike_stage, participation_title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-yellow-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-1">
                Texte de la participation
              </label>
              <textarea
                value={settings.bike_stage.participation_text}
                onChange={(e) => setSettings({
                  ...settings,
                  bike_stage: { ...settings.bike_stage, participation_text: e.target.value }
                })}
                rows={4}
                className="w-full px-3 py-2 border border-yellow-300 rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-6">
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