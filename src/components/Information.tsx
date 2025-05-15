import React from 'react';
import { Mail, Phone, Facebook, Instagram, Leaf, Recycle, Truck, Info, Calendar, Clock, MapPin, Tent } from 'lucide-react';

const Information: React.FC = () => {
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

        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-yellow-900 mb-8">Nos Partenaires</h3>
          <div className="flex justify-center items-center space-x-8">
            <a 
              href="https://picardieverte.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-105"
            >
              <img 
                src="https://picardieverte.com/wp-content/uploads/2024/09/Logo_CCPV_Green.png" 
                alt="Communauté de Communes de la Picardie Verte" 
                className="h-24 w-auto"
              />
            </a>
            <a 
              href="https://www.facebook.com/asca.beauvais" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-105"
            >
              <img 
                src="https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-1/480466632_625719733490144_7728950089363766399_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=O2c5D_bN34EQ7kNvwF8HHoP&_nc_oc=AdnGJXahZtMaABR1LCpaqm5KnLZkMS5x5d-k70nrwczVx15H6ddMU719nsFYaVKwKb5K1fUuNnsNprHZ3vOdvNk5&_nc_zt=24&_nc_ht=scontent.fcdg3-1.fna&_nc_gid=lfJ4P88MyfFQLOJrla7bGg&oh=00_AfKZe_EIAl2qlRDuTU7NMZ6tbGmWDBAQ3ZkINevBudEW1w&oe=682A655B" 
                alt="ASCA Beauvais" 
                className="h-24 w-auto rounded-full"
              />
            </a>
            <a 
              href="https://www.facebook.com/asca.beauvais" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-105"
            >
              <img 
                src="https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-6/482269515_658873380006287_7970189413545758165_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ZHwnpk-3YyUQ7kNvwEHvRUi&_nc_oc=AdmpRn-H1o9We8HXw2o9Zj0770d66Vkve7kRwpyZhecA-WgjesgK-mAefQ5CHFH1G2iwzkp6c6BnFfOEy7xMsWqu&_nc_zt=23&_nc_ht=scontent.fcdg3-1.fna&_nc_gid=sMwExsWM97j_7zOx8He3GA&oh=00_AfLiMpyAhwmIawkSQBeNzvrdNSmd_paZVcnpGOI2BXwvTQ&oe=682A5B96" 
                alt="ASCA" 
                className="h-24 w-auto"
              />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-105"
            >
              <img 
                src="https://scontent.fcdg3-1.fna.fbcdn.net/v/t39.30808-6/305698382_484806533652173_8627251451207591047_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=DAq1quBtwg0Q7kNvwGgeb5c&_nc_oc=AdnkvmZibayYHGlgOvVbauRhnDB0U4IpSBe79Uv1d_j9wFFkG_Tq3Q1W87_BL3aHUzWd2OlTJ9j-UL9MnjRAImyu&_nc_zt=23&_nc_ht=scontent.fcdg3-1.fna&_nc_gid=bzipOi0_LfHXtKqs-w2FaQ&oh=00_AfKnf9tQU37QNW1sewl-KAhC74mwe_jFIHSdMtaYS44CIQ&oe=682A576C" 
                alt="Nouveau partenaire" 
                className="h-24 w-auto"
              />
            </a>
          </div>
        </div>
        
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