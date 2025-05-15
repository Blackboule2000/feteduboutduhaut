import React, { useEffect, useState } from 'react';
import { Mail, Phone, Facebook, Instagram, Leaf, Recycle, Truck, Info, Calendar, Clock, MapPin, Tent } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  order_index: number;
  is_active: boolean;
}

const Information: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setPartners(data);
    } catch (err) {
      console.error('Erreur lors du chargement des partenaires:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="infos" className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-yellow-600 text-white py-1 px-4 rounded-full mb-4">
            <Info className="inline-block mr-2" size={18} />
            <span>Informations pratiques</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-900 mb-4">Tout ce que vous devez savoir</h2>
          <p className="text-lg text-yellow-800">
            La Fête du Bout du Haut, un événement culturel et festif au cœur de l'Oise
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-yellow-50 rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-bold text-yellow-900 mb-6">Informations essentielles</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-yellow-700 p-3 rounded-full mr-4 flex-shrink-0">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-yellow-900">Date</h4>
                  <p className="text-gray-700">Samedi 26 Juillet 2025</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-700 p-3 rounded-full mr-4 flex-shrink-0">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-yellow-900">Horaires</h4>
                  <p className="text-gray-700">De 11h00 à 02h30 du matin</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-700 p-3 rounded-full mr-4 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-yellow-900">Lieu</h4>
                  <p className="text-gray-700">2 rue du Bout du Haut</p>
                  <p className="text-gray-700">60380 Lachapelle sous Gerberoy</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Parking gratuit à proximité • À 15 min de Beauvais
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-700 p-3 rounded-full mr-4 flex-shrink-0">
                  <Tent className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-yellow-900">Camping</h4>
                  <p className="text-gray-700">Camping gratuit sur place</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Espace aménagé avec sanitaires et point d'eau
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-200 rounded-lg">
              <h4 className="font-bold text-yellow-900 mb-2">À noter</h4>
              <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                <li>Entrée gratuite pour tous</li>
                <li>Restauration locale et buvette sur place</li>
                <li>Village associatif et artisanal</li>
                <li>Animations pour petits et grands</li>
                <li>Zone ombragée et espaces de repos</li>
                <li>Accessibilité PMR</li>
                <li>Animaux acceptés tenus en laisse</li>
                <li>Parking vélos sécurisé</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg overflow-hidden shadow-md">
            <div className="h-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2579.675897572147!2d1.8431753760982296!3d49.68152437170658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e70d3e398d62d3%3A0xe26a39dff46a3e4f!2sLachapelle-sous-Gerberoy!5e0!3m2!1sfr!2sfr!4v1716824042352!5m2!1sfr!2sfr" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '400px' }} 
                allowFullScreen 
                loading="lazy"
                title="Carte"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          <div className="bg-yellow-800 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">La Scène à Vélos</h3>
            <div className="aspect-video mb-6 rounded-lg overflow-hidden">
              <img 
                src="https://www.asca-asso.com/wp-content/uploads/2022/05/la-scene-a-velo-1024x400.png" 
                alt="Scène à vélo" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mb-4">
              Cette année, la Fête du Bout du Haut innove et s'engage en accueillant la Scène à Vélos ! 
              Bien plus qu'une simple scène, c'est une véritable expérience interactive et respectueuse 
              de l'environnement qui vous attend.
            </p>
            <p className="mb-4">
              Imaginez une scène mobile, dont l'énergie nécessaire aux concerts est produite directement 
              sur place ! Grâce à ses 7 vélogénérateurs et 2 panneaux solaires, la Scène à Vélos 
              fonctionne à l'énergie verte.
            </p>
            <div className="aspect-video mb-6 rounded-lg overflow-hidden">
              <img 
                src="https://www.asca-asso.com/wp-content/uploads/2025/02/SDS96588-1024x683.webp" 
                alt="Scène à vélo en action" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mb-4">
              Et le plus beau ? Vous, spectateurs et spectatrices de la Fête du Bout du Haut, êtes 
              invité.e.s à devenir acteurs de cette production d'énergie ! Avant les concerts, participez 
              à des actions ludiques de sensibilisation à la maîtrise de l'énergie en pédalant. Et pendant 
              les concerts, continuez à faire vivre la scène par votre énergie collective !
            </p>
          </div>

          <div className="bg-yellow-800 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Un festival éco-responsable</h3>
            <div className="space-y-6">
              <div className="bg-yellow-700/30 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Recycle className="h-6 w-6 mr-2" />
                  <h4 className="text-xl font-bold">Zéro déchet</h4>
                </div>
                <ul className="space-y-2">
                  <li>• Gobelets réutilisables consignés</li>
                  <li>• Tri sélectif avec points de collecte dédiés</li>
                  <li>• Vaisselle réutilisables consignés pour la restauration</li>
                  <li>• Sensibilisation au tri avec des bénévoles</li>
                </ul>
              </div>
              
              <div className="bg-yellow-700/30 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Truck className="h-6 w-6 mr-2" />
                  <h4 className="text-xl font-bold">Circuit court & Local</h4>
                </div>
                <ul className="space-y-2">
                  <li>• Producteurs et artisans locaux</li>
                  <li>• Bières artisanales de la région</li>
                  <li>• Restauration privilégiant les produits de saison</li>
                  <li>• Partenariats avec les commerces locaux</li>
                </ul>
              </div>
              
              <div className="bg-yellow-700/30 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Leaf className="h-6 w-6 mr-2" />
                  <h4 className="text-xl font-bold">Initiatives vertes</h4>
                </div>
                <ul className="space-y-2">
                  <li>• Scène à vélos alimentée par énergie humaine</li>
                  <li>• Parking vélos sécurisé et gratuit</li>
                  <li>• Toilettes sèches et économie d'eau</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {!loading && partners.length > 0 && (
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-yellow-900 mb-8">Nos Partenaires</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {partners.map((partner) => (
                <a 
                  key={partner.id}
                  href={partner.website_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform duration-300 hover:scale-105"
                >
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name} 
                    className="h-24 w-auto"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div itemScope itemType="https://schema.org/LocalBusiness" className="hidden">
          <meta itemProp="name" content="Fête du Bout du Haut" />
          <meta itemProp="description" content="Festival gratuit de musique et d'animations à Lachapelle sous Gerberoy" />
          <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <meta itemProp="streetAddress" content="2 rue du Bout du Haut" />
            <meta itemProp="addressLocality" content="Lachapelle sous Gerberoy" />
            <meta itemProp="postalCode" content="60380" />
            <meta itemProp="addressCountry" content="FR" />
          </div>
          <meta itemProp="telephone" content="+33623456789" />
          <meta itemProp="email" content="association.boutduhaut@gmail.com" />
          <meta itemProp="openingHours" content="2025-07-26T11:00/2025-07-27T02:30" />
        </div>
      </div>
    </section>
  );
};

export default Information;