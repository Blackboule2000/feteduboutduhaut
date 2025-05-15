import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';

interface ConcertFormProps {
  concertId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface ConcertFormData {
  name: string;
  time: string;
  description: string;
  image_url: string;
  audio_url: string;
  video_url: string;
  stage: string;
  order_index: number;
}

const ConcertForm: React.FC<ConcertFormProps> = ({ concertId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ConcertFormData>({
    name: '',
    time: '',
    description: '',
    image_url: '',
    audio_url: '',
    video_url: '',
    stage: 'Grande Scène',
    order_index: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (concertId) {
      loadConcertData();
    }
  }, [concertId]);

  const loadConcertData = async () => {
    try {
      const { data, error } = await supabase
        .from('concerts')
        .select('*')
        .eq('id', concertId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement du concert:', err);
      setError('Erreur lors du chargement du concert');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (concertId) {
        const { error } = await supabase
          .from('concerts')
          .update(formData)
          .eq('id', concertId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('concerts')
          .insert([formData]);

        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError('Erreur lors de l\'enregistrement du concert');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value;
    // Convert YouTube watch URLs to embed URLs
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        url = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    setFormData({ ...formData, video_url: url });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-yellow-900 mb-6">
          {concertId ? 'Modifier le concert' : 'Nouveau concert'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              Nom du groupe
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="ex: 20:30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              Scène
            </label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              required
            >
              <option value="Grande Scène">Grande Scène</option>
              <option value="Scène à Vélo">Scène à Vélo</option>
              <option value="Hors Scène">Hors Scène</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              URL du fichier audio
            </label>
            <input
              type="url"
              value={formData.audio_url}
              onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              URL de la vidéo YouTube
            </label>
            <input
              type="url"
              value={formData.video_url}
              onChange={handleVideoUrlChange}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="https://www.youtube.com/watch?v=... ou https://www.youtube.com/embed/..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Vous pouvez coller l'URL YouTube standard ou l'URL d'intégration
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              Ordre d'affichage
            </label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default ConcertForm;