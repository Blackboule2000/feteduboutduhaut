import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  time: string;
  description: string;
  icon: string;
  image_url?: string;
  order_index: number;
}

const ActivityForm: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iconOptions = [
    'Users', 'Tent', 'Utensils', 'Beer', 'ShoppingBag', 'CircusIcon', 'BookOpen'
  ];

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setActivities(data);
    } catch (err) {
      console.error('Erreur lors du chargement des activités:', err);
      setError('Erreur lors du chargement des activités');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (selectedActivity?.id) {
        const { error } = await supabase
          .from('activities')
          .update({
            name: selectedActivity.name,
            time: selectedActivity.time,
            description: selectedActivity.description,
            icon: selectedActivity.icon,
            image_url: selectedActivity.image_url,
            order_index: selectedActivity.order_index
          })
          .eq('id', selectedActivity.id);

        if (error) throw error;
      } else if (selectedActivity) {
        const { error } = await supabase
          .from('activities')
          .insert([{
            name: selectedActivity.name,
            time: selectedActivity.time,
            description: selectedActivity.description,
            icon: selectedActivity.icon,
            image_url: selectedActivity.image_url,
            order_index: selectedActivity.order_index
          }]);

        if (error) throw error;
      }

      await loadActivities();
      setShowForm(false);
      setSelectedActivity(null);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError('Erreur lors de l\'enregistrement de l\'activité');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadActivities();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de l\'activité');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => {
            setSelectedActivity({
              id: '',
              name: '',
              time: '',
              description: '',
              icon: 'Users',
              image_url: '',
              order_index: activities.length
            });
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle activité
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {activity.image_url && (
                    <img
                      src={activity.image_url}
                      alt={activity.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-yellow-900">
                      {activity.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedActivity(activity);
                      setShowForm(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showForm && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedActivity(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-yellow-900 mb-6">
              {selectedActivity.id ? 'Modifier l\'activité' : 'Nouvelle activité'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Nom de l'activité
                </label>
                <input
                  type="text"
                  value={selectedActivity.name}
                  onChange={(e) => setSelectedActivity({ ...selectedActivity, name: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Horaire
                </label>
                <input
                  type="text"
                  value={selectedActivity.time}
                  onChange={(e) => setSelectedActivity({ ...selectedActivity, time: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="ex: 14:00 - 18:00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedActivity.description}
                  onChange={(e) => setSelectedActivity({ ...selectedActivity, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Icône
                </label>
                <select
                  value={selectedActivity.icon}
                  onChange={(e) => setSelectedActivity({ ...selectedActivity, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  URL de l'image
                </label>
                <input
                  type="url"
                  value={selectedActivity.image_url || ''}
                  onChange={(e) => setSelectedActivity({ ...selectedActivity, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="https://exemple.com/image.jpg"
                />
                {selectedActivity.image_url && (
                  <img
                    src={selectedActivity.image_url}
                    alt="Aperçu"
                    className="mt-2 max-h-48 rounded"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={selectedActivity.order_index}
                  onChange={(e) => setSelectedActivity({ ...selectedActivity, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedActivity(null);
                  }}
                  className="px-4 py-2 border border-yellow-300 rounded-md text-yellow-700 hover:bg-yellow-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityForm;