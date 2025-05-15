import React, { useEffect, useState } from 'react';
import FlipTimer from './FlipTimer';
import { supabase } from '../lib/supabase';

interface HomeSettings {
  main_image: {
    url: string;
    alt: string;
  };
  poster: {
    url: string;
    alt: string;
  };
  countdown: {
    enabled: boolean;
    date: string;
    time: string;
  };
  birds: {
    enabled: boolean;
    quantity: number;
  };
}

const defaultSettings: HomeSettings = {
  main_image: {
    url: 'http://www.image-heberg.fr/files/1747215665990305646.png',
    alt: 'Logo Fête du Bout du Haut'
  },
  poster: {
    url: 'http://www.image-heberg.fr/files/17472124523185540990.jpg',
    alt: 'Affiche Fête du Bout du Haut 2025'
  },
  countdown: {
    enabled: true,
    date: '2025-07-26',
    time: '11:00'
  },
  birds: {
    enabled: true,
    quantity: 6
  }
};

const Hero: React.FC = () => {
  const [settings, setSettings] = useState<HomeSettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'home_settings')
        .maybeSingle();

      if (data?.value) {
        setSettings(data.value);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
    }
  };

  const renderBirds = (quantity: number) => {
    const birds = [];
    for (let i = 0; i < quantity; i++) {
      birds.push(
        <div 
          key={i}
          className="absolute transform"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            rotate: `${Math.random() * 360}deg`,
            opacity: 0.2 + Math.random() * 0.3
          }}
        >
          <img 
            src="http://www.image-heberg.fr/files/17472137482209719273.png" 
            alt="Hirondelle décorative" 
            className="w-8 h-auto"
          />
        </div>
      );
    }
    return birds;
  };

  return (
    <section 
      id="accueil" 
      className="relative min-h-screen overflow-hidden bg-[#f6d9a0]"
    >
      <div className="absolute inset-0 bg-retro-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-noise opacity-20"></div>
      
      {settings.birds.enabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {renderBirds(settings.birds.quantity)}
        </div>
      )}
      
      <div className="relative w-full pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center relative">
            <img 
              src={settings.main_image.url}
              alt={settings.main_image.alt}
              className="mx-auto mb-8 w-[1000px] max-w-full h-auto"
              style={{ 
                filter: 'brightness(1.1) saturate(0.85) contrast(0.9)',
                mixBlendMode: 'multiply'
              }}
            />
          </div>
        </div>
      </div>

      {settings.countdown.enabled && (
        <div className="relative z-20 -mt-8 mb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-[#f6d9a0] rounded-xl p-6">
              <h2 className="floating-text text-center font-['Swiss 721 Black Extended BT'] text-4xl md:text-5xl text-[#ca5231] mb-8 tracking-wider font-bold">
                RENDEZ-VOUS DANS
              </h2>
              <FlipTimer targetDate={new Date(`${settings.countdown.date}T${settings.countdown.time}`)} />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto relative">
          <img 
            src={settings.poster.url}
            alt={settings.poster.alt}
            className="w-full h-auto rounded-lg shadow-2xl mb-12"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;