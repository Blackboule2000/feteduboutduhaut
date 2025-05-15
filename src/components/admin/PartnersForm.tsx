import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, X, ExternalLink } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  order_index: number;
  is_active: boolean;
}

const PartnersForm: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setPartners(data);
    } catch (err) {
      console.error('Erreur lors du chargement des partenaires:', err);
      setError('Erreur lors du chargement des partenaires');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (selectedPartner?.id) {
        const { error } = await supabase
          .from('partners')
          .update({
            name: selectedPartner.name,
            logo_url: selectedPartner.logo_url,
            website_url: selectedPartner.website_url,
            order_index: selectedPartner.order_index,
            is_active: selectedPartner.is_active
          })
          .eq('id', selectedPartner.id);

        if (error) throw error;
      } else if (selectedPartner) {
        const { error } = await supabase
          .from('partners')
          .insert([{
            name: selectedPartner.name,
            logo_url: selectedPartner.logo_url,
            website_url: selectedPartner.website_url,
            order_index: selectedPartner.order_index,
            is_active: selectedPartner.is_active
          }]);

        if (error) throw error;
      }

      await loadPartners();
      setShowForm(false);
      setSelectedPartner(null);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError('Erreur lors de l\'enregistrement du partenaire');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadPartners();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression du partenaire');
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
            setSelectedPartner({
              id: '',
              name: '',
              logo_url: '',
              website_url: '',
              order_index: partners.length,
              is_active: true
            });
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau partenaire
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden ${
              !partner.is_active ? 'opacity-50' : ''
            }`}
          >
            <div className="p-4">
              <div className="aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-yellow-900">
                    {partner.name}
                  </h3>
                  {partner.website_url && (
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-yellow-600 hover:text-yellow-800 flex items-center mt-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Site web
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPartner(partner);
                      setShowForm(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(partner.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedPartner(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-yellow-900 mb-6">
              {selectedPartner.id ? 'Modifier le partenaire' : 'Nouveau partenaire'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Nom du partenaire
                </label>
                <input
                  type="text"
                  value={selectedPartner.name}
                  onChange={(e) => setSelectedPartner({ ...selectedPartner, name: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  URL du logo
                </label>
                <input
                  type="url"
                  value={selectedPartner.logo_url}
                  onChange={(e) => setSelectedPartner({ ...selectedPartner, logo_url: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="https://example.com/logo.png"
                  required
                />
                {selectedPartner.logo_url && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                    <img
                      src={selectedPartner.logo_url}
                      alt="Logo"
                      className="max-h-40 mx-auto"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  URL du site web
                </label>
                <input
                  type="url"
                  value={selectedPartner.website_url || ''}
                  onChange={(e) => setSelectedPartner({ ...selectedPartner, website_url: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={selectedPartner.order_index}
                  onChange={(e) => setSelectedPartner({ ...selectedPartner, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedPartner.is_active}
                  onChange={(e) => setSelectedPartner({ ...selectedPartner, is_active: e.target.checked })}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
                />
                <label className="ml-2 block text-sm text-yellow-700">
                  Partenaire actif
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedPartner(null);
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

export default PartnersForm;