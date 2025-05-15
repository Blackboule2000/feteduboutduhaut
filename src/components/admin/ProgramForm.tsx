import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, X, Clock, MapPin, Palette, Video, Music, Image as ImageIcon } from 'lucide-react';

interface Program {
  id: string;
  time: string;
  title: string;
  description: string | null;
  stage: string;
  order_index: number;
  image_url: string | null;
  color: string;
  video_url: string | null;
  audio_url: string | null;
  gallery_urls: string[];
  background_image: string | null;
}

const ProgramForm: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('program')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setPrograms(data);
    } catch (err) {
      console.error('Error loading programs:', err);
      setError('Error loading programs');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (selectedProgram?.id) {
        const { error } = await supabase
          .from('program')
          .update({
            title: selectedProgram.title,
            time: selectedProgram.time,
            description: selectedProgram.description,
            stage: selectedProgram.stage,
            order_index: selectedProgram.order_index,
            image_url: selectedProgram.image_url,
            color: selectedProgram.color,
            video_url: selectedProgram.video_url,
            audio_url: selectedProgram.audio_url,
            gallery_urls: selectedProgram.gallery_urls,
            background_image: selectedProgram.background_image
          })
          .eq('id', selectedProgram.id);

        if (error) throw error;
      } else if (selectedProgram) {
        const { error } = await supabase
          .from('program')
          .insert([selectedProgram]);

        if (error) throw error;
      }

      await loadPrograms();
      setShowForm(false);
      setSelectedProgram(null);
    } catch (err) {
      console.error('Error saving program:', err);
      setError('Error saving program');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this program item?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('program')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadPrograms();
    } catch (err) {
      console.error('Error during deletion:', err);
      setError('Error deleting program item');
    }
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        url = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    setSelectedProgram(prev => prev ? { ...prev, video_url: url } : null);
  };

  const addGalleryUrl = (url: string) => {
    if (selectedProgram) {
      setSelectedProgram({
        ...selectedProgram,
        gallery_urls: [...selectedProgram.gallery_urls, url]
      });
    }
  };

  const removeGalleryUrl = (index: number) => {
    if (selectedProgram) {
      const newUrls = [...selectedProgram.gallery_urls];
      newUrls.splice(index, 1);
      setSelectedProgram({
        ...selectedProgram,
        gallery_urls: newUrls
      });
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
            setSelectedProgram({
              id: '',
              title: '',
              time: '',
              description: '',
              stage: 'Grande Scène',
              order_index: programs.length,
              image_url: '',
              color: '#ca5231',
              video_url: '',
              audio_url: '',
              gallery_urls: [],
              background_image: ''
            });
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Program
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {programs.map((item) => (
            <li key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-start space-x-6">
                {item.image_url && (
                  <div className="flex-shrink-0 w-48">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-yellow-900 truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProgram(item);
                          setShowForm(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-900 transition-colors duration-150"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-150"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {item.time}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {item.stage}
                    </span>
                    {item.color && (
                      <span className="flex items-center">
                        <Palette className="h-4 w-4 mr-1" />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center space-x-4">
                    {item.video_url && (
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Video className="h-4 w-4 mr-1" />
                        Video
                      </span>
                    )}
                    {item.audio_url && (
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Music className="h-4 w-4 mr-1" />
                        Audio
                      </span>
                    )}
                    {item.gallery_urls.length > 0 && (
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <ImageIcon className="h-4 w-4 mr-1" />
                        {item.gallery_urls.length} images
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showForm && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedProgram(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-yellow-900 mb-6">
              {selectedProgram.id ? 'Edit Program Item' : 'New Program Item'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={selectedProgram.title}
                  onChange={(e) => setSelectedProgram({ ...selectedProgram, title: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={selectedProgram.time}
                    onChange={(e) => setSelectedProgram({ ...selectedProgram, time: e.target.value })}
                    className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="e.g., 14:00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-700 mb-1">
                    Stage
                  </label>
                  <select
                    value={selectedProgram.stage}
                    onChange={(e) => setSelectedProgram({ ...selectedProgram, stage: e.target.value })}
                    className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  >
                    <option value="Grande Scène">Grande Scène</option>
                    <option value="Scène à Vélo">Scène à Vélo</option>
                    <option value="Hors Scène">Hors Scène</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedProgram.description || ''}
                  onChange={(e) => setSelectedProgram({ ...selectedProgram, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Image URL
                  </div>
                </label>
                <input
                  type="url"
                  value={selectedProgram.image_url || ''}
                  onChange={(e) => setSelectedProgram({ ...selectedProgram, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="https://example.com/image.jpg"
                />
                {selectedProgram.image_url && (
                  <img
                    src={selectedProgram.image_url}
                    alt="Preview"
                    className="mt-2 max-h-40 rounded-md"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video URL
                  </div>
                </label>
                <input
                  type="url"
                  value={selectedProgram.video_url || ''}
                  onChange={handleVideoUrlChange}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="YouTube URL or embed URL"
                />
                {selectedProgram.video_url && (
                  <div className="mt-2 aspect-video">
                    <iframe
                      src={selectedProgram.video_url}
                      className="w-full h-full rounded-md"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Audio URL
                  </div>
                </label>
                <input
                  type="url"
                  value={selectedProgram.audio_url || ''}
                  onChange={(e) => setSelectedProgram({ ...selectedProgram, audio_url: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="https://example.com/audio.mp3"
                />
                {selectedProgram.audio_url && (
                  <audio
                    controls
                    src={selectedProgram.audio_url}
                    className="w-full mt-2"
                  >
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Gallery URLs
                  </div>
                </label>
                <div className="space-y-2">
                  {selectedProgram.gallery_urls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const newUrls = [...selectedProgram.gallery_urls];
                          newUrls[index] = e.target.value;
                          setSelectedProgram({ ...selectedProgram, gallery_urls: newUrls });
                        }}
                        className="flex-1 px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="https://example.com/gallery-image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryUrl(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addGalleryUrl('')}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <Plus className="h-5 w-5" />
                    Add Gallery Image
                  </button>
                </div>
                {selectedProgram.gallery_urls.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {selectedProgram.gallery_urls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Background Image URL
                  </div>
                </label>
                <input
                  type="url"
                  value={selectedProgram.background_image || ''}
                  onChange={(e) => setSelectedProgram({ ...selectedProgram, background_image: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="https://example.com/background.jpg"
                />
                {selectedProgram.background_image && (
                  <img
                    src={selectedProgram.background_image}
                    alt="Background Preview"
                    className="mt-2 max-h-40 rounded-md"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color
                  </div>
                </label>
                <input
                  type="color"
                  value={selectedProgram.color}
                  onChange={(e) => setSelectedProgram({ ...selectedProgram, color: e.target.value })}
                  className="w-full h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Order Index
                </label>
                <input
                  type="number"
                  value={selectedProgram.order_index}
                  onChange={(e) => setSelectedProgram({ ...selectedProgram, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedProgram(null);
                  }}
                  className="px-4 py-2 border border-yellow-300 rounded-md text-yellow-700 hover:bg-yellow-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramForm;