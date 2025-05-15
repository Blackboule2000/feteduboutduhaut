import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedNewsIndex, setSelectedNewsIndex] = useState<number>(0);
  const [isModalEntering, setIsModalEntering] = useState(false);

  useEffect(() => {
    loadNews();
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
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? newsData.length - 1 : prevIndex - 1
    );
  };

  const openModal = (news: NewsItem) => {
    const index = newsData.findIndex(item => item.id === news.id);
    setSelectedNewsIndex(index);
    setSelectedNews(news);
    setIsModalEntering(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalEntering(false);
    setTimeout(() => {
      setSelectedNews(null);
      document.body.style.overflow = '';
    }, 300);
  };

  const navigateModal = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (selectedNewsIndex + 1) % newsData.length
      : selectedNewsIndex === 0 ? newsData.length - 1 : selectedNewsIndex - 1;
    
    setSelectedNewsIndex(newIndex);
    setSelectedNews(newsData[newIndex]);
  };

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
          <div className="relative h-[700px] overflow-hidden">
            {newsData.map((news, index) => (
              <div
                key={news.id}
                className={`absolute inset-0 transition-all duration-1000 transform ${
                  index === currentIndex 
                    ? 'opacity-100 translate-x-0 scale-100' 
                    : index < currentIndex
                    ? 'opacity-0 -translate-x-full scale-95'
                    : 'opacity-0 translate-x-full scale-95'
                }`}
              >
                <div className="polaroid-card h-full transform hover:rotate-1 transition-transform duration-500 bg-[#f6d9a0]">
                  <div className="tape tape-top"></div>
                  <div className="tape tape-left"></div>
                  <div className="tape tape-right"></div>
                  
                  <div 
                    className="polaroid-image relative h-[70%] overflow-hidden mb-6 group"
                  >
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                      <button 
                        onClick={() => openModal(news)}
                        className="px-8 py-3 bg-[#ca5231] text-white rounded-full opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 font-['Railroad Gothic'] text-lg hover:bg-[#ca5231]/80"
                      >
                        En savoir plus
                      </button>
                    </div>
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
                    <p className="text-xl text-[#ca5231]/80 line-clamp-3 font-['Rainy Days'] leading-relaxed">
                      {news.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
            {newsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  index === currentIndex 
                    ? 'bg-[#ca5231] scale-110' 
                    : 'bg-[#ca5231]/30 hover:bg-[#ca5231]/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedNews && (
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
                src={selectedNews.image_url}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 pt-0">
              <a href="#" className="polaroid-date mb-6 font-['Railroad Gothic'] text-xl text-[#ca5231] inline-block bg-[#ca5231]/10 px-4 py-2 rounded-full hover:bg-[#ca5231]/20 transition-colors">
                {new Date(selectedNews.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </a>

              <a href="#" className="block text-4xl font-bold text-[#ca5231] mb-12 font-['Swiss 721 Black Extended BT'] hover:translate-x-2 transition-transform">
                {selectedNews.title}
              </a>

              <a href="#" className="block text-xl text-[#ca5231]/80 font-['Rainy Days'] leading-relaxed whitespace-pre-line hover:text-[#ca5231] transition-colors mt-8">
                {selectedNews.description}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default News;