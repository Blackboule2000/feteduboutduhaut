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
        <div className="text-center max-w-3xl mx-auto mb-8">
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

        {/* Points de navigation */}
        <div className="flex justify-center space-x-2 mb-8">
          {newsData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setExpandedId(null);
              }}
              className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                index === currentIndex 
                  ? 'bg-[#ca5231] scale-110' 
                  : 'bg-[#ca5231]/30 hover:bg-[#ca5231]/50'
              }`}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="relative min-h-[500px] max-h-[800px] overflow-hidden">
            {newsData.map((news, index) => {
              const isExpanded = expandedId === news.id;
              
              return (
                <div
                  key={news.id}
                  className={`absolute inset-0 transition-all duration-1000 transform ${
                    index === currentIndex 
                      ? 'opacity-100 translate-x-0' 
                      : index < currentIndex
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-xl p-6 mx-4">
                    <div className="relative aspect-video mb-6 overflow-hidden rounded-lg">
                      <img
                        src={news.image_url}
                        alt={news.title}
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    
                    <div className="text-center">
                      <div className="mb-4 text-lg text-[#ca5231]/80 font-['Railroad Gothic']">
                        {new Date(news.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-[#ca5231] mb-4 font-['Swiss 721 Black Extended BT']">
                        {news.title}
                      </h3>
                      
                      <div className={`relative overflow-hidden transition-all duration-500 ${
                        isExpanded ? 'max-h-[1000px]' : 'max-h-[100px]'
                      }`}>
                        <p className="text-lg text-[#ca5231]/80 font-['Rainy Days'] leading-relaxed">
                          {news.description}
                        </p>
                        {!isExpanded && (
                          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => toggleExpand(news.id)}
                        className="mt-4 inline-flex items-center px-6 py-3 bg-[#ca5231] text-white rounded-full hover:bg-[#ca5231]/80 transition-all duration-300 transform hover:scale-105"
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
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ca5231] text-white p-4 rounded-full z-30 transition-all duration-300 transform hover:scale-110 hover:bg-[#ca5231]/80"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ca5231] text-white p-4 rounded-full z-30 transition-all duration-300 transform hover:scale-110 hover:bg-[#ca5231]/80"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;