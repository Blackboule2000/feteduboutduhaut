import React, { useState } from 'react';
import { Mail, Phone, Facebook, Instagram, Send, MapPin } from 'lucide-react';
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
    <section id="contact" className="py-20 bg-[#f6d9a0] relative overflow-hidden">
      <div className="absolute inset-0 bg-retro-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-noise opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-[#ca5231]/10 text-[#ca5231] py-2 px-6 rounded-full mb-4">
            <span className="font-['Railroad Gothic'] text-xl">CONTACTEZ-NOUS</span>
          </div>
          <h2 className="font-['Swiss 721 Black Extended BT'] text-4xl md:text-5xl mb-4 text-[#ca5231]">
            ON RESTE EN CONTACT
          </h2>
          <p className="font-['Rainy Days'] text-xl text-[#ca5231]/80">
            Une question ? Besoin d'information ? L'équipe de l'Association du Bout du Haut est à votre écoute !
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#ca5231]/20 blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg transform transition-all duration-500 hover:rotate-1">
              <div className="absolute inset-0 border-[8px] border-[#ca5231]/20 rounded-xl pointer-events-none"></div>
              <div className="absolute inset-[8px] border-[2px] border-[#ca5231]/30 rounded-lg pointer-events-none"></div>
              
              <h3 className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] mb-8">
                Informations de contact
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6 group/item">
                  <div className="bg-[#ca5231] p-4 rounded-full transform transition-transform duration-300 group-hover/item:rotate-12">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-['Railroad Gothic'] text-[#ca5231] mb-1">Email</h4>
                    <a 
                      href="mailto:association.boutduhaut@gmail.com" 
                      className="text-[#ca5231]/80 hover:text-[#ca5231] transition-colors font-['Rainy Days'] text-lg"
                    >
                      association.boutduhaut@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6 group/item">
                  <div className="bg-[#ca5231] p-4 rounded-full transform transition-transform duration-300 group-hover/item:rotate-12">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-['Railroad Gothic'] text-[#ca5231] mb-1">Téléphone</h4>
                    <a 
                      href="tel:+33623456789" 
                      className="text-[#ca5231]/80 hover:text-[#ca5231] transition-colors font-['Rainy Days'] text-lg"
                    >
                      +33 (0)6 23 45 67 89
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group/item">
                  <div className="bg-[#ca5231] p-4 rounded-full transform transition-transform duration-300 group-hover/item:rotate-12">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-['Railroad Gothic'] text-[#ca5231] mb-1">Adresse</h4>
                    <p className="text-[#ca5231]/80 font-['Rainy Days'] text-lg">
                      2 rue du Bout du Haut<br />
                      60380 Lachapelle sous Gerberoy
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h4 className="text-lg font-['Railroad Gothic'] text-[#ca5231] mb-4">
                  Suivez-nous
                </h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.facebook.com/AssociationDuBoutDuHaut" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#ca5231] p-3 rounded-full text-white hover:bg-[#ca5231]/80 transition-colors transform hover:rotate-12 transition-transform duration-300"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://www.instagram.com/association_du_bout_du_haut" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#ca5231] p-3 rounded-full text-white hover:bg-[#ca5231]/80 transition-colors transform hover:rotate-12 transition-transform duration-300"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-[#ca5231]/20 blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg transform transition-all duration-500 hover:rotate-1">
              <div className="absolute inset-0 border-[8px] border-[#ca5231]/20 rounded-xl pointer-events-none"></div>
              <div className="absolute inset-[8px] border-[2px] border-[#ca5231]/30 rounded-lg pointer-events-none"></div>
              
              <h3 className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] mb-8">
                Envoyez-nous un message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-md font-['Rainy Days']">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-md font-['Rainy Days']">
                    Votre message a été envoyé avec succès !
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-lg font-['Railroad Gothic'] text-[#ca5231] mb-2">
                    Nom
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-white/50 border-2 border-[#ca5231]/20 rounded-xl focus:border-[#ca5231] focus:ring focus:ring-[#ca5231]/20 transition-all duration-300 font-['Rainy Days'] text-lg text-[#ca5231]"
                    placeholder="Votre nom"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-lg font-['Railroad Gothic'] text-[#ca5231] mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-white/50 border-2 border-[#ca5231]/20 rounded-xl focus:border-[#ca5231] focus:ring focus:ring-[#ca5231]/20 transition-all duration-300 font-['Rainy Days'] text-lg text-[#ca5231]"
                    placeholder="Votre email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-lg font-['Railroad Gothic'] text-[#ca5231] mb-2">
                    Message
                  </label>
                  <textarea 
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6} 
                    className="w-full px-6 py-4 bg-white/50 border-2 border-[#ca5231]/20 rounded-xl focus:border-[#ca5231] focus:ring focus:ring-[#ca5231]/20 transition-all duration-300 font-['Rainy Days'] text-lg text-[#ca5231]"
                    placeholder="Votre message"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full bg-[#ca5231] text-white py-4 px-8 rounded-xl font-['Railroad Gothic'] text-xl flex items-center justify-center space-x-3 hover:bg-[#ca5231]/90 transform hover:scale-105 transition-all duration-300 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>{loading ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;