import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image_url: string;
}

const NewsForm: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      if (data) setNews(data);
    } catch (err) {
      console.error('Erreur lors du chargement des actualités:', err);
      setError('Erreur lors du chargement des actualités');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (selectedNews?.id) {
        const { error } = await supabase
          .from('news')
          .update({
            title: selectedNews.title,
            date: selectedNews.date,
            description: selectedNews.description,
            image_url: selectedNews.image_url
          })
          .eq('id', selectedNews.id);

        if (error) throw error;
      } else if (selectedNews) {
        const { error } = await supabase
          .from('news')
          .insert([{
            title: selectedNews.title,
            date: selectedNews.date,
            description: selectedNews.description,
            image_url: selectedNews.image_url
          }]);

        if (error) throw error;
      }

      await loadNews();
      setShowForm(false);
      setSelectedNews(null);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError('Erreur lors de l\'enregistrement de l\'actualité');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadNews();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de l\'actualité');
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
            setSelectedNews({
              id: '',
              title: '',
              date: new Date().toISOString().split('T')[0],
              description: '',
              image_url: ''
            });
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle actualité
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {news.map((item) => (
            <li key={item.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-16 w-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-yellow-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedNews(item);
                      setShowForm(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

      {showForm && selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedNews(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-yellow-900 mb-6">
              {selectedNews.id ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  value={selectedNews.title}
                  onChange={(e) => setSelectedNews({ ...selectedNews, title: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedNews.date}
                  onChange={(e) => setSelectedNews({ ...selectedNews, date: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedNews.description}
                  onChange={(e) => setSelectedNews({ ...selectedNews, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  URL de l'image
                </label>
                <input
                  type="url"
                  value={selectedNews.image_url}
                  onChange={(e) => setSelectedNews({ ...selectedNews, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="https://exemple.com/image.jpg"
                />
                {selectedNews.image_url && (
                  <img
                    src={selectedNews.image_url}
                    alt="Aperçu"
                    className="mt-2 max-h-48 rounded"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedNews(null);
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

export default NewsForm;