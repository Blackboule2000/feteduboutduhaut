import React, { useEffect, useState } from 'react';
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

      {selectedActivity && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            isModalEntering 
              ? 'opacity-100 bg-black/60 backdrop-blur-sm' 
              : 'opacity-0 bg-black/0 backdrop-blur-none'
          }`}
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-8 right-8 bg-[#f6d9a0] text-[#ca5231] p-2 rounded-full shadow-lg hover:bg-[#ca5231] hover:text-[#f6d9a0] transform hover:rotate-90 transition-all duration-300"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateModal('prev');
            }}
            className="absolute left-8 top-1/2 -translate-y-1/2 bg-[#f6d9a0] text-[#ca5231] p-2 rounded-full shadow-lg hover:bg-[#ca5231] hover:text-[#f6d9a0] transform hover:scale-110 transition-all duration-300"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateModal('next');
            }}
            className="absolute right-8 top-1/2 -translate-y-1/2 bg-[#f6d9a0] text-[#ca5231] p-2 rounded-full shadow-lg hover:bg-[#ca5231] hover:text-[#f6d9a0] transform hover:scale-110 transition-all duration-300"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div 
            className={`polaroid-card max-w-4xl w-full max-h-[90vh] overflow-y-auto relative transform ${
              isModalEntering 
                ? 'translate-y-0 opacity-100 scale-100 rotate-0' 
                : 'translate-y-8 opacity-0 scale-95 rotate-2'
            } transition-all duration-500 bg-[#f6d9a0]`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tape tape-top"></div>
            <div className="tape tape-left"></div>
            <div className="tape tape-right"></div>

            <div className="relative aspect-video mb-8 rounded-lg overflow-hidden shadow-xl">
              <img
                src={selectedActivity.image_url}
                alt={selectedActivity.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 pt-0">
              <a href="#" className="polaroid-date mb-6 font-['Railroad Gothic'] text-xl text-[#ca5231] inline-block bg-[#ca5231]/10 px-4 py-2 rounded-full hover:bg-[#ca5231]/20 transition-colors">
                {selectedActivity.time}
              </a>

              <div className="flex items-center space-x-4 mb-12">
                <div className="bg-[#ca5231] p-4 rounded-full">
                  {getIcon(selectedActivity.icon)({ className: "h-8 w-8 text-[#f6d9a0]" })}
                </div>
                <a href="#" className="block text-4xl font-bold text-[#ca5231] font-['Swiss 721 Black Extended BT'] hover:translate-x-2 transition-transform">
                  {selectedActivity.name}
                </a>
              </div>

              <a href="#" className="block text-xl text-[#ca5231]/80 font-['Rainy Days'] leading-relaxed whitespace-pre-line hover:text-[#ca5231] transition-colors mt-8">
                {selectedActivity.description}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Activities;