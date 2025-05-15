import React, { useState, useEffect } from 'react';
import { getIcon } from '../data';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState<number>(0);
  const [isModalEntering, setIsModalEntering] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
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

  const openModal = (activity: Activity) => {
    const index = activities.findIndex(item => item.id === activity.id);
    setSelectedActivityIndex(index);
    setSelectedActivity(activity);
    setIsModalEntering(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalEntering(false);
    setTimeout(() => {
      setSelectedActivity(null);
      document.body.style.overflow = '';
    }, 300);
  };

  const navigateModal = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next'
      ? (selectedActivityIndex + 1) % activities.length
      : selectedActivityIndex === 0 ? activities.length - 1 : selectedActivityIndex - 1;
    
    setSelectedActivityIndex(newIndex);
    setSelectedActivity(activities[newIndex]);
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
                className="relative group transform transition-all duration-500 hover:scale-102 cursor-pointer"
                onClick={() => openModal(activity)}
              >
                <div className="absolute inset-0 bg-[#ca5231]/20 blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                <div className="activity-card bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden transform transition-all duration-500 hover:rotate-1 relative">
                  <div className="absolute inset-0 border-[8px] border-[#ca5231]/20 rounded-xl pointer-events-none"></div>
                  <div className="absolute inset-[8px] border-[2px] border-[#ca5231]/30 rounded-lg pointer-events-none"></div>
                  
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
                        {IconComponent && <IconComponent className="h-6 w-6 text-[#f6d9a0]" />}
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

      {selectedActivity && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-500"
          onClick={closeModal}
        >
          <div className={`absolute inset-0 bg-gradient-to-br from-[#ca5231]/95 to-[#f6d9a0]/95 backdrop-blur-lg transition-opacity duration-500 ${
            isModalEntering ? 'opacity-100' : 'opacity-0'
          }`}></div>

          <div className={`relative w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 transform ${
            isModalEntering ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
          }`} onClick={e => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative h-[50vh] overflow-hidden">
              {selectedActivity.image_url && (
                <img
                  src={selectedActivity.image_url}
                  alt={selectedActivity.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-[#ca5231] p-3 rounded-full">
                    {(() => {
                      const IconComponent = getIcon(selectedActivity.icon);
                      return IconComponent && <IconComponent className="h-6 w-6 text-white" />;
                    })()}
                  </div>
                  <span className="font-['Railroad Gothic'] text-2xl">
                    {selectedActivity.time}
                  </span>
                </div>
                <h3 className="font-['Swiss 721 Black Extended BT'] text-4xl mb-2">
                  {selectedActivity.name}
                </h3>
              </div>
            </div>

            <div className="p-8 bg-white">
              <p className="font-['Rainy Days'] text-xl text-[#ca5231]/80 leading-relaxed">
                {selectedActivity.description}
              </p>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateModal('prev');
                }}
                className="pointer-events-auto bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateModal('next');
                }}
                className="pointer-events-auto bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Activities;