import React from 'react';
import { Music, MapPin, Calendar, Lock } from 'lucide-react';
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
              <a href="https://www.facebook.com/AssociationDuBoutDuHaut/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/association_du_bout_du_haut/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
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