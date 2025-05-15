import React, { useEffect, useState } from 'react';
import FlipTimer from './FlipTimer';
import { supabase } from '../lib/supabase';

interface PosterSettings {
  image_url: string;
  alt_text: string;
  enabled: boolean;
}

const defaultPosterSettings: PosterSettings = {
  image_url: 'http://www.image-heberg.fr/files/17472124523185540990.jpg',
  alt_text: 'Affiche Fête du Bout du Haut 2025',
  enabled: true
};

const Hero: React.FC = () => {
  const [posterSettings, setPosterSettings] = useState<PosterSettings>(defaultPosterSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'poster_settings')
        .maybeSingle();

      if (error) throw error;
      if (data?.value) {
        setPosterSettings({ ...defaultPosterSettings, ...data.value });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
    }
  };

  return (
    <section 
      id="accueil" 
      className="relative min-h-screen overflow-hidden bg-[#f6d9a0]"
    >
      <div className="absolute inset-0 bg-retro-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-noise opacity-20"></div>
      
      {/* Hirondelles dans le fond - Couche 1 */}
      <div className="absolute top-1/6 left-1/6 transform rotate-12">
        <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-8 h-auto" style={{ opacity: 0.3 }} />
      </div>
      <div className="absolute top-1/4 right-1/5 transform -rotate-12">
        <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-6 h-auto" style={{ opacity: 0.2 }} />
      </div>
      <div className="absolute bottom-1/3 left-1/4 transform rotate-45">
        <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-10 h-auto" style={{ opacity: 0.25 }} />
      </div>
      
      {/* Hirondelles dans le fond - Couche 2 */}
      <div className="absolute top-1/3 left-1/3 transform -rotate-15">
        <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-7 h-auto" style={{ opacity: 0.15 }} />
      </div>
      <div className="absolute top-2/3 right-1/4 transform rotate-30">
        <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-5 h-auto" style={{ opacity: 0.2 }} />
      </div>
      <div className="absolute bottom-1/4 left-1/5 transform -rotate-25">
        <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-9 h-auto" style={{ opacity: 0.3 }} />
      </div>

      {/* Title Section with Enlarged Image */}
      <div className="relative w-full pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center relative">
            {/* Hirondelles autour du titre - Gauche */}
            <div className="absolute -left-4 top-1/4 transform -rotate-12">
              <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-8 h-auto" style={{ opacity: 0.7 }} />
            </div>
            <div className="absolute left-1/4 -top-8 transform rotate-25">
              <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-6 h-auto" style={{ opacity: 0.6 }} />
            </div>
            
            {/* Hirondelles autour du titre - Droite */}
            <div className="absolute -right-4 top-1/3 transform rotate-12">
              <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-8 h-auto" style={{ opacity: 0.7 }} />
            </div>
            <div className="absolute right-1/4 -top-6 transform -rotate-25">
              <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-6 h-auto" style={{ opacity: 0.6 }} />
            </div>
            
            <img 
              src="http://www.image-heberg.fr/files/1747215665990305646.png"
              alt="Fête du Bout du Haut"
              className="mx-auto mb-8 w-[1000px] max-w-full h-auto"
              style={{ 
                filter: 'brightness(1.1) saturate(0.85) contrast(0.9)',
                mixBlendMode: 'multiply'
              }}
            />
          </div>
        </div>
      </div>

      {/* Timer Section */}
      <div className="relative z-20 -mt-8 mb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#f6d9a0] rounded-xl p-6">
            <h2 className="floating-text text-center font-['Swiss 721 Black Extended BT'] text-4xl md:text-5xl text-[#ca5231] mb-8 tracking-wider font-bold">
              RENDEZ-VOUS DANS
            </h2>
            <FlipTimer targetDate={new Date("Jul 26, 2025 11:00:00")} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 z-10">
        {/* Poster Section */}
        {posterSettings.enabled && (
          <div className="max-w-4xl mx-auto relative">
            {/* Hirondelles autour de l'affiche */}
            <div className="absolute -top-12 -left-16 transform rotate-25">
              <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-10 h-auto" style={{ opacity: 0.8 }} />
            </div>
            <div className="absolute top-1/6 -right-20 transform -rotate-15">
              <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-8 h-auto" style={{ opacity: 0.7 }} />
            </div>
            <div className="absolute bottom-1/4 -left-24 transform rotate-45">
              <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-12 h-auto" style={{ opacity: 0.9 }} />
            </div>
            <div className="absolute -bottom-8 right-1/4 transform -rotate-30">
              <img src="http://www.image-heberg.fr/files/17472137482209719273.png" alt="Hirondelle" className="w-9 h-auto" style={{ opacity: 0.8 }} />
            </div>
            
            <img 
              src={posterSettings.image_url}
              alt={posterSettings.alt_text}
              className="w-full h-auto rounded-lg shadow-2xl mb-12"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultPosterSettings.image_url;
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;