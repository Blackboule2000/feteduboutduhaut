import React, { useEffect, useState } from 'react';
import { getIcon } from '../data';
import { supabase } from '../lib/supabase';

interface Activity {
  id: string;
  name: string;
  time: string;
  description: string;
  icon: string;
  image_url?: string;
  order_index: number;
}

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setActivities(data);
    } catch (err) {
      console.error('Erreur lors du chargement des activités:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="activites" className="relative py-20 bg-[#f6d9a0] overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">Chargement des activités...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="activites" className="relative py-20 bg-[#f6d9a0] overflow-hidden">
      <div className="absolute inset-0 bg-retro-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-noise opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-[#ca5231]/10 text-[#ca5231] py-2 px-6 rounded-full mb-4">
            <span className="font-['Railroad Gothic'] text-xl">ANIMATIONS</span>
          </div>
          <h2 className="font-['Swiss 721 Black Extended BT'] text-4xl md:text-5xl mb-4 text-[#ca5231]">
            ACTIVITÉS & ANIMATIONS
          </h2>
          <p className="font-['Rainy Days'] text-xl text-[#ca5231]/80">
            De nombreuses activités pour petits et grands tout au long de la journée
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {activities.map((activity) => {
            const IconComponent = getIcon(activity.icon);
            
            return (
              <div 
                key={activity.id} 
                className="relative group transform transition-all duration-500 hover:scale-102"
              >
                <div className="absolute inset-0 bg-[#ca5231]/20 blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                <div className="activity-card bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden transform transition-all duration-500 hover:rotate-1 relative">
                  {/* Bordure ornementale */}
                  <div className="absolute inset-0 border-[8px] border-[#ca5231]/20 rounded-xl pointer-events-none"></div>
                  <div className="absolute inset-[8px] border-[2px] border-[#ca5231]/30 rounded-lg pointer-events-none"></div>
                  
                  {/* Coins ornementaux */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#ca5231]/40 rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#ca5231]/40 rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#ca5231]/40 rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#ca5231]/40 rounded-br-xl"></div>

                  <div className="relative p-6">
                    {activity.image_url && (
                      <div className="relative aspect-video mb-6 overflow-hidden rounded-xl shadow-xl">
                        <div className="absolute inset-0 bg-[#ca5231]/10"></div>
                        <img 
                          src={activity.image_url} 
                          alt={activity.name}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#ca5231] p-3 rounded-full">
                        <IconComponent className="h-6 w-6 text-[#f6d9a0]" />
                      </div>
                      <div>
                        <h3 className="font-['Swiss 721 Black Extended BT'] text-xl text-[#ca5231] mb-1">
                          {activity.name}
                        </h3>
                        <p className="font-['Railroad Gothic'] text-lg text-[#ca5231]/80">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                    <p className="font-['Rainy Days'] text-lg text-[#ca5231]/90 mt-4">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ca5231]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ca5231]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
    </section>
  );
};

export default Activities;