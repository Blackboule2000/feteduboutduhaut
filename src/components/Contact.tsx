import React, { useState } from 'react';
import { Mail, Phone, Facebook, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-yellow-50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-yellow-900 mb-4">Contactez-nous</h2>
          <p className="text-lg text-yellow-800">
            Une question? Besoin d'information? L'équipe de l'Association du Bout du Haut est à votre écoute!
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-bold text-yellow-900 mb-6">Informations de contact</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-yellow-700 p-3 rounded-full mr-4 flex-shrink-0">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-yellow-900">Email</h4>
                  <a href="mailto:association.boutduhaut@gmail.com" className="text-yellow-700 hover:text-yellow-900">
                    association.boutduhaut@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-700 p-3 rounded-full mr-4 flex-shrink-0">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-yellow-900">Téléphone</h4>
                  <a href="tel:+33623456789" className="text-yellow-700 hover:text-yellow-900">
                    +33 (0)6 23 45 67 89
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-700 p-3 rounded-full mr-4 flex-shrink-0">
                  <Facebook className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-yellow-900">Facebook</h4>
                  <a href="https://www.facebook.com/associationduboutduhaut" className="text-yellow-700 hover:text-yellow-900">
                    @associationduboutduhaut
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-700 p-3 rounded-full mr-4 flex-shrink-0">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-yellow-900">Instagram</h4>
                  <a href="https://www.instagram.com/feteduboutduhaut" className="text-yellow-700 hover:text-yellow-900">
                    @feteduboutduhaut
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-bold text-yellow-900 mb-6">Envoyez-nous un message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-md">
                  Votre message a été envoyé avec succès !
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-yellow-900 mb-1">Nom</label>
                <input 
                  type="text" 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Votre nom"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-yellow-900 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Votre email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-yellow-900 mb-1">Message</label>
                <textarea 
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4} 
                  className="w-full px-4 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Votre message"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className={`bg-yellow-800 text-white py-2 px-6 rounded-md hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;