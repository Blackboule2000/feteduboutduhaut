import React, { useState, useEffect } from 'react';
import { Menu, X, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface HeaderSettings {
  logo: {
    image_url: string;
    alt_text: string;
    link_url: string;
  };
  title: {
    text: string;
    font_family: string;
    color: string;
  };
  navigation: Array<{
    text: string;
    link: string;
    icon: string | null;
  }>;
  decorative_elements: {
    show_birds: boolean;
    show_windmill: boolean;
    bird_image_url: string;
    windmill_image_url: string;
  };
  styles: {
    background_color: string;
    text_color: string;
    hover_color: string;
    shadow_enabled: boolean;
    sticky_enabled: boolean;
  };
}

const defaultSettings: HeaderSettings = {
  logo: {
    image_url: 'https://i.ibb.co/652PBzS/logo-f-te-du-bout-du-haut-2.png',
    alt_text: 'Logo Fête du Bout du Haut',
    link_url: '/'
  },
  title: {
    text: 'FÊTE DU BOUT DU HAUT',
    font_family: 'Swiss 721 Black Extended BT',
    color: '#ca5231'
  },
  navigation: [
    { text: 'ACCUEIL', link: '#accueil', icon: null },
    { text: 'ACTUALITÉS', link: '#actualités', icon: null },
    { text: 'PROGRAMME', link: '#programme', icon: null },
    { text: 'ACTIVITÉS', link: '#activites', icon: null },
    { text: 'INFORMATIONS', link: '#infos', icon: null },
    { text: 'CONTACT', link: '#contact', icon: null }
  ],
  decorative_elements: {
    show_birds: true,
    show_windmill: true,
    bird_image_url: 'http://www.image-heberg.fr/files/17472137482209719273.png',
    windmill_image_url: 'https://i.ibb.co/SwjYfyNK/olienne.png'
  },
  styles: {
    background_color: '#f6d9a0',
    text_color: '#ca5231',
    hover_color: '#365d66',
    shadow_enabled: true,
    sticky_enabled: true
  }
};

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<HeaderSettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'header_settings')
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la requête:', error);
        return;
      }

      if (!data) {
        const { error: insertError } = await supabase
          .from('settings')
          .insert({
            key: 'header_settings',
            value: defaultSettings
          });

        if (insertError) {
          console.error('Erreur lors de la création des paramètres par défaut:', insertError);
          return;
        }
      } else {
        setSettings(data.value);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (href.startsWith('#')) {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      } ${settings.styles.shadow_enabled ? 'shadow-lg' : ''}`}
      style={{ 
        backgroundColor: settings.styles.background_color
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center relative">
          {settings.decorative_elements.show_birds && (
            <>
              <div className="absolute left-24 -top-6 hidden md:block">
                <img 
                  src={settings.decorative_elements.bird_image_url}
                  alt="Hirondelle" 
                  className="w-6 h-auto transform -translate-y-2 rotate-12"
                  style={{ opacity: 0.7 }}
                />
              </div>
              <div className="absolute left-40 -top-4 hidden md:block">
                <img 
                  src={settings.decorative_elements.bird_image_url}
                  alt="Hirondelle" 
                  className="w-5 h-auto transform rotate-6"
                  style={{ opacity: 0.6 }}
                />
              </div>
              <div className="absolute left-52 -top-2 hidden md:block">
                <img 
                  src={settings.decorative_elements.bird_image_url}
                  alt="Hirondelle" 
                  className="w-4 h-auto"
                  style={{ opacity: 0.5 }}
                />
              </div>
              <div className="absolute right-48 -top-8 hidden md:block">
                <img 
                  src={settings.decorative_elements.bird_image_url}
                  alt="Hirondelle" 
                  className="w-5 h-auto transform rotate-12"
                  style={{ opacity: 0.6 }}
                />
              </div>
              <div className="absolute right-36 -top-4 hidden md:block">
                <img 
                  src={settings.decorative_elements.bird_image_url}
                  alt="Hirondelle" 
                  className="w-4 h-auto transform -rotate-6"
                  style={{ opacity: 0.5 }}
                />
              </div>
              <div className="absolute right-28 -top-6 hidden md:block">
                <img 
                  src={settings.decorative_elements.bird_image_url}
                  alt="Hirondelle" 
                  className="w-6 h-auto transform rotate-[-12deg]"
                  style={{ opacity: 0.7 }}
                />
              </div>
            </>
          )}
          
          <div className="flex items-center flex-1 md:flex-none">
            <Link 
              to={settings.logo.link_url}
              className="flex items-center space-x-4 group"
            >
              <div className="relative overflow-hidden rounded-full transform transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={settings.logo.image_url}
                  alt={settings.logo.alt_text}
                  className="h-12 md:h-16 w-12 md:w-16 object-contain"
                />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span 
                className="font-['Swiss 721 Black Extended BT'] text-lg md:text-2xl uppercase tracking-wider font-bold truncate"
                style={{ color: settings.styles.text_color }}
              >
                {settings.title.text}
              </span>
            </Link>
            
            {settings.decorative_elements.show_windmill && (
              <div className="ml-8 relative hidden md:block">
                <img 
                  src={settings.decorative_elements.windmill_image_url}
                  alt="Éolienne" 
                  className="w-8 h-auto"
                  style={{ opacity: 0.85 }}
                />
                <img 
                  src={settings.decorative_elements.bird_image_url}
                  alt="Hirondelle" 
                  className="w-4 h-auto absolute -top-2 -right-3 transform rotate-[-25deg]"
                  style={{ opacity: 0.7 }}
                />
              </div>
            )}
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {settings.navigation.map((item) => (
              <a
                key={item.text}
                href={item.link}
                onClick={(e) => handleNavClick(e, item.link)}
                className="font-['Swiss 721 Black Extended BT'] transition-all duration-300 transform hover:scale-105"
                style={{ 
                  color: settings.styles.text_color,
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = settings.styles.hover_color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = settings.styles.text_color;
                }}
              >
                {item.text}
                <span 
                  className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 transition-transform duration-300 origin-left hover:scale-x-100"
                  style={{ backgroundColor: settings.styles.hover_color }}
                ></span>
              </a>
            ))}

            <div className="flex items-center space-x-4 ml-8">
              <a
                href="https://www.facebook.com/AssociationDuBoutDuHaut/"
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-all duration-300 hover:scale-110"
                style={{ color: settings.styles.text_color }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = settings.styles.hover_color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = settings.styles.text_color;
                }}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/association_du_bout_du_haut/"
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-all duration-300 hover:scale-110"
                style={{ color: settings.styles.text_color }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = settings.styles.hover_color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = settings.styles.text_color;
                }}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@AssociationduBoutduHaut"
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-all duration-300 hover:scale-110"
                style={{ color: settings.styles.text_color }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = settings.styles.hover_color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = settings.styles.text_color;
                }}
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </nav>
          
          <button 
            className="md:hidden transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
            style={{ color: settings.styles.text_color }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isOpen && (
          <div className="md:hidden mt-4 rounded-lg bg-white/95 backdrop-blur-sm shadow-lg border border-white/20">
            <nav className="flex flex-col space-y-4 p-4">
              {settings.navigation.map((item) => (
                <a
                  key={item.text}
                  href={item.link}
                  onClick={(e) => handleNavClick(e, item.link)}
                  className="font-['Swiss 721 Black Extended BT'] transition-all duration-300 transform hover:translate-x-2"
                  style={{ color: settings.styles.text_color }}
                >
                  {item.text}
                </a>
              ))}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <a
                  href="https://www.facebook.com/AssociationDuBoutDuHaut/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform transition-all duration-300 hover:scale-110"
                  style={{ color: settings.styles.text_color }}
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/association_du_bout_du_haut/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform transition-all duration-300 hover:scale-110"
                  style={{ color: settings.styles.text_color }}
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.youtube.com/@AssociationduBoutduHaut"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform transition-all duration-300 hover:scale-110"
                  style={{ color: settings.styles.text_color }}
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;