import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image_url: string;
}

const News: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });

      if (data) {
        setNewsData(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des actualités:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === newsData.length - 1 ? 0 : prevIndex + 1
    );
    setExpandedId(null);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? newsData.length - 1 : prevIndex - 1
    );
    setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [newsData.length]);

  if (loading) {
    return (
      <section id="actualités" className="py-20 relative overflow-hidden bg-[#f6d9a0]">
        <div className="container mx-auto px-4">
          <div className="text-center">Chargement des actualités...</div>
        </div>
      </section>
    );
  }

  if (newsData.length === 0) {
    return (
      <section id="actualités" className="py-20 relative overflow-hidden bg-[#f6d9a0]">
        <div className="container mx-auto px-4">
          <div className="text-center">Aucune actualité disponible pour le moment.</div>
        </div>
      </section>
    );
  }

  return (
    <section id="actualités" className="py-20 relative overflow-hidden bg-[#f6d9a0]">
      <div className="absolute inset-0 bg-retro-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-noise opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="vintage-button inline-block mb-4 bg-[#ca5231]/10 px-6 py-2 rounded-full">
            <span className="text-[#ca5231] font-['Railroad Gothic']">DERNIÈRES NOUVELLES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#ca5231] mb-4 font-['Swiss 721 Black Extended BT']">
            Actualités
          </h2>
          <p className="text-lg text-[#ca5231]/80 font-['Rainy Days']">
            Les dernières nouvelles du festival
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Points de navigation déplacés en haut */}
          <div className="flex justify-center space-x-2 mb-8">
            {newsData.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setExpandedId(null);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  index === currentIndex 
                    ? 'bg-[#ca5231] scale-110' 
                    : 'bg-[#ca5231]/30 hover:bg-[#ca5231]/50'
                }`}
              />
            ))}
          </div>

          <div className="relative h-[700px] overflow-hidden">
            {newsData.map((news, index) => {
              const tapeRotation = Math.random() * 6 - 3;
              const isExpanded = expandedId === news.id;
              
              return (
                <div
                  key={news.id}
                  className={`absolute inset-0 transition-all duration-1000 transform ${
                    index === currentIndex 
                      ? 'opacity-100 rotate-0 scale-100' 
                      : index < currentIndex
                      ? 'opacity-0 -rotate-12 scale-90'
                      : 'opacity-0 rotate-12 scale-90'
                  }`}
                  style={{
                    '--rotation': `${Math.random() * 3 - 1.5}deg`,
                    '--tape-rotation': `${tapeRotation}deg`
                  } as React.CSSProperties}
                >
                  <div 
                    className={`polaroid-card h-full transform hover:rotate-1 transition-all duration-500 bg-[#f6d9a0] cursor-pointer ${
                      isExpanded ? 'scale-105' : ''
                    }`}
                    onClick={() => toggleExpand(news.id)}
                  >
                    <div className="tape tape-top"></div>
                    <div className="tape tape-left"></div>
                    <div className="tape tape-right"></div>
                    
                    <div className={`polaroid-image relative ${isExpanded ? 'h-[40%]' : 'h-[70%]'} overflow-hidden mb-6 transition-all duration-500`}>
                      <img
                        src={news.image_url}
                        alt={news.title}
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                        style={{
                          animation: index === currentIndex ? 'subtle-zoom 20s infinite alternate' : 'none'
                        }}
                      />
                    </div>
                    <div className="text-center px-8">
                      <div className="polaroid-date mb-4 font-['Railroad Gothic'] text-xl">
                        {new Date(news.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      <h3 className="text-3xl font-bold text-[#ca5231] mb-4 transform hover:translate-x-2 transition-transform font-['Swiss 721 Black Extended BT']">
                        {news.title}
                      </h3>
                      <div className={`relative overflow-hidden transition-all duration-500 ${
                        isExpanded ? 'max-h-[500px]' : 'max-h-[100px]'
                      }`}>
                        <p className="text-xl text-[#ca5231]/80 transform hover:translate-y-[-2px] transition-transform font-['Rainy Days'] leading-relaxed">
                          {news.description}
                        </p>
                        <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f6d9a0] to-transparent ${
                          isExpanded ? 'hidden' : 'block'
                        }`}></div>
                      </div>
                      <button 
                        className="mt-6 inline-flex items-center px-6 py-2 bg-[#ca5231] text-white rounded-full hover:bg-[#ca5231]/80 transition-colors text-lg font-['Railroad Gothic']"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(news.id);
                        }}
                      >
                        {isExpanded ? (
                          <>
                            Voir moins <ChevronUp className="ml-2 w-5 h-5" />
                          </>
                        ) : (
                          <>
                            Lire la suite <ChevronDown className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#f6d9a0]/80 backdrop-blur-sm shadow-lg hover:bg-[#ca5231]/10 text-[#ca5231] p-4 rounded-full z-30 transition-all duration-300 transform hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#f6d9a0]/80 backdrop-blur-sm shadow-lg hover:bg-[#ca5231]/10 text-[#ca5231] p-4 rounded-full z-30 transition-all duration-300 transform hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;