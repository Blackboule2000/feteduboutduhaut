import React from 'react';
import { Music, MapPin, Calendar, Lock, Youtube, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-yellow-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Fête du Bout du Haut</h3>
            <p className="mb-4">
              Un événement festif, musical et culturel au cœur de Lachapelle sous Gerberoy.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/AssociationDuBoutDuHaut/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-yellow-300 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://www.instagram.com/association_du_bout_du_haut/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-yellow-300 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://www.youtube.com/@AssociationduBoutduHaut" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-yellow-300 transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Information</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>26 Juillet 2025</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Lachapelle sous Gerberoy</span>
              </li>
              <li className="flex items-center">
                <Music className="h-5 w-5 mr-2" />
                <span>5 concerts</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><a href="#accueil" className="hover:text-yellow-300 transition-colors">Accueil</a></li>
              <li><a href="#actualités" className="hover:text-yellow-300 transition-colors">Actualités</a></li>
              <li><a href="#programme" className="hover:text-yellow-300 transition-colors">Programme</a></li>
              <li><a href="#activites" className="hover:text-yellow-300 transition-colors">Activités</a></li>
              <li><a href="#infos" className="hover:text-yellow-300 transition-colors">Informations</a></li>
              <li><a href="#contact" className="hover:text-yellow-300 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-yellow-800 text-center">
          <p className="text-sm text-yellow-400 mb-4">
            &copy; {new Date().getFullYear()} Fête du Bout du Haut - Tous droits réservés
          </p>
          <Link 
            to="/admin" 
            className="inline-flex items-center text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <Lock className="h-4 w-4 mr-1" />
            Administration
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;