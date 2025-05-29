import React, { useEffect, useState } from 'react';
import { Mail, Phone, Facebook, Instagram, Leaf, Recycle, Truck, Info, Calendar, Clock, MapPin, Tent, ArrowRight, Music, Beer, ShoppingBag, Users, Bike } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('infos');

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

  const tabs = [
    { id: 'infos', label: 'Infos Pratiques', icon: Info },
    { id: 'eco', label: 'Éco-responsable', icon: Leaf },
    { id: 'scene', label: 'Scène à Vélos', icon: Bike }
  ];

  const essentialInfo = [
    { icon: Calendar, title: 'Date', text: 'Samedi 26 Juillet 2025' },
    { icon: Clock, title: 'Horaires', text: 'De 11h00 à 02h30' },
    { icon: MapPin, title: 'Lieu', text: '2 rue du Bout du Haut, 60380 Lachapelle sous Gerberoy' },
    { icon: Music, title: 'Concerts', text: '5 concerts sur 2 scènes' },
    { icon: Beer, title: 'Bar & Food', text: 'Buvette et restauration sur place' },
    { icon: ShoppingBag, title: 'Village', text: 'Artisans et producteurs locaux' }
  ];

  const importantNotes = [
    'Entrée gratuite pour tous',
    'Restauration locale et buvette sur place',
    'Village associatif et artisanal',
    'Animations pour petits et grands',
    'Zone ombragée et espaces de repos',
    'Accessibilité PMR',
    'Animaux acceptés tenus en laisse',
    'Parking vélos sécurisé'
  ];

  const ecoInitiatives = [
    {
      title: 'Zéro déchet',
      icon: Recycle,
      items: [
        'Gobelets réutilisables consignés',
        'Tri sélectif avec points de collecte dédiés',
        'Vaisselle réutilisable pour la restauration',
        'Sensibilisation au tri avec des bénévoles'
      ]
    },
    {
      title: 'Circuit court & Local',
      icon: Truck,
      items: [
        'Producteurs et artisans locaux',
        'Bières artisanales de la région',
        'Restauration privilégiant les produits de saison',
        'Partenariats avec les commerces locaux'
      ]
    },
    {
      title: 'Initiatives vertes',
      icon: Leaf,
      items: [
        'Scène à vélos alimentée par énergie humaine',
        'Parking vélos sécurisé et gratuit',
        'Toilettes sèches et économie d\'eau'
      ]
    }
  ];

  return (
    <section id="infos" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-retro-pattern opacity-5"></div>
      <div className="absolute inset-0 bg-noise opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-[#ca5231]/10 text-[#ca5231] py-2 px-6 rounded-full mb-4">
            <Info className="inline-block mr-2 h-5 w-5" />
            <span className="font-['Railroad Gothic']">INFORMATIONS PRATIQUES</span>
          </div>
          <h2 className="font-['Swiss 721 Black Extended BT'] text-4xl md:text-5xl mb-4 text-[#ca5231]">
            TOUT CE QUE VOUS DEVEZ SAVOIR
          </h2>
          <p className="font-['Rainy Days'] text-xl text-[#ca5231]/80">
            La Fête du Bout du Haut, un événement culturel et festif au cœur de l'Oise
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-[#f6d9a0] rounded-full p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-[#ca5231] text-white shadow-lg transform scale-105' 
                    : 'text-[#ca5231] hover:bg-[#ca5231]/10'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                <span className="font-['Railroad Gothic']">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-16">
          {activeTab === 'infos' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {essentialInfo.map((info, index) => (
                  <div 
                    key={index}
                    className="bg-[#f6d9a0]/30 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-[#ca5231] p-3 rounded-full">
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="ml-4 text-xl font-['Swiss 721 Black Extended BT'] text-[#ca5231]">
                        {info.title}
                      </h3>
                    </div>
                    <p className="text-lg font-['Rainy Days'] text-[#ca5231]/80 group-hover:text-[#ca5231] transition-colors">
                      {info.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#f6d9a0] rounded-xl overflow-hidden shadow-lg">
                  <div className="p-8">
                    <h3 className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] mb-6">
                      Camping Festival
                    </h3>
                    <div className="flex items-start mb-6">
                      <div className="bg-[#ca5231] p-3 rounded-full">
                        <Tent className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-['Rainy Days'] text-[#ca5231]/80 mb-2">
                          Camping gratuit sur place
                        </p>
                        <p className="text-sm text-[#ca5231]/60">
                          Espace aménagé avec sanitaires et point d'eau
                        </p>
                      </div>
                    </div>
                    <img 
                      src="https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg"
                      alt="Camping"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                </div>

                <div className="bg-[#f6d9a0] rounded-xl overflow-hidden shadow-lg">
                  <div className="p-8">
                    <h3 className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] mb-6">
                      À noter
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {importantNotes.map((note, index) => (
                        <div 
                          key={index}
                          className="flex items-center space-x-2 text-[#ca5231]/80 hover:text-[#ca5231] transition-colors"
                        >
                          <ArrowRight className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm font-['Rainy Days']">{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#f6d9a0] rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-[21/9] relative">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2579.675897572147!2d1.8431753760982296!3d49.68152437170658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e70d3e398d62d3%3A0xe26a39dff46a3e4f!2sLachapelle-sous-Gerberoy!5e0!3m2!1sfr!2sfr!4v1716824042352!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eco' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ecoInitiatives.map((initiative, index) => (
                <div 
                  key={index}
                  className="bg-[#f6d9a0] rounded-xl p-8 transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-[#ca5231] p-3 rounded-full">
                      <initiative.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="ml-4 text-xl font-['Swiss 721 Black Extended BT'] text-[#ca5231]">
                      {initiative.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {initiative.items.map((item, itemIndex) => (
                      <li 
                        key={itemIndex}
                        className="flex items-start space-x-2 text-[#ca5231]/80"
                      >
                        <ArrowRight className="h-5 w-5 flex-shrink-0 mt-1" />
                        <span className="font-['Rainy Days']">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'scene' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#f6d9a0] rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://www.asca-asso.com/wp-content/uploads/2022/05/la-scene-a-velo-1024x400.png"
                  alt="Scène à vélo"
                  className="w-full h-48 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] mb-4">
                    La Scène à Vélos
                  </h3>
                  <p className="font-['Rainy Days'] text-[#ca5231]/80 mb-6">
                    Cette année, la Fête du Bout du Haut innove et s'engage en accueillant la Scène à Vélos ! 
                    Bien plus qu'une simple scène, c'est une véritable expérience interactive et respectueuse 
                    de l'environnement qui vous attend.
                  </p>
                  <div className="flex items-center justify-between text-sm text-[#ca5231]/60">
                    <span>7 vélogénérateurs</span>
                    <span>2 panneaux solaires</span>
                    <span>100% énergie verte</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f6d9a0] rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://www.asca-asso.com/wp-content/uploads/2025/02/SDS96588-1024x683.webp"
                  alt="Scène à vélo en action"
                  className="w-full h-48 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] mb-4">
                    Participez à l'expérience
                  </h3>
                  <p className="font-['Rainy Days'] text-[#ca5231]/80">
                    Et le plus beau ? Vous, spectateurs et spectatrices de la Fête du Bout du Haut, êtes 
                    invité.e.s à devenir acteurs de cette production d'énergie ! Avant les concerts, participez 
                    à des actions ludiques de sensibilisation à la maîtrise de l'énergie en pédalant. Et pendant 
                    les concerts, continuez à faire vivre la scène par votre énergie collective !
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading && partners.length > 0 && (
            <div className="pt-16 border-t border-[#ca5231]/10">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] mb-4">
                  NOS PARTENAIRES
                </h3>
                <p className="font-['Rainy Days'] text-lg text-[#ca5231]/80">
                  Ils nous font confiance et nous soutiennent
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {partners.map((partner) => (
                  <a 
                    key={partner.id}
                    href={partner.website_url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-32 transform hover:scale-105 transition-all duration-300"
                  >
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name}
                      className="max-h-24 w-auto filter hover:brightness-110 transition-all duration-300"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Information;