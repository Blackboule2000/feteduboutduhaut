import React, { useState, useEffect } from 'react';
import { Music, Bike, Star, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Program {
  id: string;
  time: string;
  title: string;
  description: string;
  stage: string;
  order_index: number;
  image_url?: string;
  video_url?: string;
  audio_url?: string;
  color?: string;
}

const Schedule: React.FC = () => {
  const [program, setProgram] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    loadProgram();
  }, []);

  const loadProgram = async () => {
    try {
      const { data, error } = await supabase
        .from('program')
        .select('*')
        .order('time', { ascending: true });

      if (error) throw error;
      if (data) setProgram(data);
    } catch (err) {
      console.error('Erreur lors du chargement du programme:', err);
    } finally {
      setLoading(false);
    }
  };

  const AudioPlayer = ({ url }: { url: string | null }) => {
    if (!url) return null;
    return (
      <div className="mt-4">
        <audio controls className="w-full">
          <source src={url} type="audio/mpeg" />
          Votre navigateur ne supporte pas la lecture audio.
        </audio>
      </div>
    );
  };

  const VideoPlayer = ({ url }: { url: string | undefined }) => {
    if (!url) return null;

    // Convert YouTube watch URLs to embed URLs if needed
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return (
      <div className="mt-4 aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={embedUrl}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  };

  const MainArtistCard = ({ concert }: { concert: Program }) => (
    <div className="relative group transform transition-all duration-500 hover:scale-105">
      <div className="absolute inset-0 bg-[#ca5231]/20 blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
      <div className="bg-[#f6d9a0] rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 border-[12px] border-[#ca5231]/20 rounded-xl"></div>
        
        {concert.image_url && (
          <div className="relative aspect-[21/9] overflow-hidden">
            <img 
              src={concert.image_url}
              alt={concert.title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-[#ca5231] p-3 rounded-full">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl text-white font-['Railroad Gothic']">
                  {concert.time}
                </span>
                <span className="text-2xl text-white/80 font-['Rainy Days']">
                  {concert.stage}
                </span>
              </div>
              <h3 className="text-5xl md:text-6xl text-white font-['Swiss 721 Black Extended BT'] mb-4">
                {concert.title}
              </h3>
            </div>
          </div>
        )}
        
        <div className="p-8">
          <p className="text-2xl text-[#ca5231]/80 font-['Rainy Days'] mb-6 leading-relaxed">
            {concert.description}
          </p>
          {concert.audio_url && <AudioPlayer url={concert.audio_url} />}
          {concert.video_url && <VideoPlayer url={concert.video_url} />}
        </div>
      </div>
    </div>
  );

  const ConcertCard = ({ concert }: { concert: Program }) => (
    <div className="transform transition-all duration-500 hover:scale-102">
      <div className="relative group">
        <div className="absolute inset-0 bg-[#ca5231]/20 blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
        <div className="bg-[#f6d9a0] rounded-xl overflow-hidden relative h-full">
          <div className="absolute inset-0 border-[8px] border-[#ca5231]/20 rounded-xl"></div>
          
          {concert.image_url && (
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={concert.image_url}
                alt={concert.title}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {concert.stage === "Scène à Vélo" ? (
                  <Bike className="h-5 w-5 text-[#ca5231]" />
                ) : (
                  <Music className="h-5 w-5 text-[#ca5231]" />
                )}
                <span className="text-lg font-['Railroad Gothic'] text-[#ca5231]">
                  {concert.time}
                </span>
              </div>
              <span className="text-sm font-['Rainy Days'] text-[#ca5231]/80">
                {concert.stage}
              </span>
            </div>
            
            <h3 className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] mb-4">
              {concert.title}
            </h3>
            
            <p className="text-lg text-[#ca5231]/80 font-['Rainy Days'] mb-6">
              {concert.description}
            </p>
            
            {concert.audio_url && <AudioPlayer url={concert.audio_url} />}
            {concert.video_url && <VideoPlayer url={concert.video_url} />}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section id="programme" className="relative py-20 bg-festival-turquoise overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Chargement du programme...</div>
        </div>
      </section>
    );
  }

  // Tri des concerts par horaire
  const sortedProgram = [...program].sort((a, b) => {
    const timeA = parseInt(a.time.split(':')[0]);
    const timeB = parseInt(b.time.split(':')[0]);
    return timeA - timeB;
  });

  // Séparation des concerts
  const motolo = sortedProgram.find(concert => concert.title === "MOTOLO");
  const arbas = sortedProgram.find(concert => concert.title === "Arbas");
  const afterParty = sortedProgram.find(concert => concert.title === "Anna Rudy & Paul Lazarus");
  const dayConcerts = sortedProgram.filter(concert => 
    concert.title !== "MOTOLO" && 
    concert.title !== "Arbas" && 
    concert.title !== "Anna Rudy & Paul Lazarus"
  );

  return (
    <section id="programme" className="relative py-20 bg-festival-turquoise overflow-hidden">
      <div className="absolute inset-0 bg-retro-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-noise opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="vintage-button inline-block mb-4">
            <Music className="inline-block mr-2" size={18} />
            <span className="font-['Railroad Gothic']">CONCERTS</span>
          </div>
          <h2 className="font-['Swiss 721 Black Extended BT'] text-4xl md:text-5xl mb-4 font-bold text-[#f6d9a0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            PROGRAMMATION
          </h2>
          <p className="text-xl text-[#f6d9a0]/90 font-['Rainy Days']">
            Une soirée exceptionnelle avec des artistes talentueux
          </p>
        </div>

        {motolo && (
          <div className="mb-16">
            <MainArtistCard concert={motolo} />
          </div>
        )}

        {arbas && (
          <div className="max-w-4xl mx-auto mb-16">
            <MainArtistCard concert={arbas} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {dayConcerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </div>

        {afterParty && (
          <div className="max-w-3xl mx-auto mt-20">
            <div className="text-center mb-8">
              <div className="inline-block bg-[#f6d9a0] text-[#ca5231] py-2 px-6 rounded-full mb-4">
                <span className="font-['Railroad Gothic'] text-xl">AFTER PARTY</span>
              </div>
              <h3 className="font-['Swiss 721 Black Extended BT'] text-3xl text-[#f6d9a0] mb-2">
                LA FÊTE CONTINUE
              </h3>
              <p className="text-xl text-[#f6d9a0]/90 font-['Rainy Days']">
                Pour danser jusqu'au bout de la nuit
              </p>
            </div>
            <ConcertCard concert={afterParty} />
          </div>
        )}

        <div className="mt-20 bg-[#f6d9a0]/90 backdrop-blur-sm rounded-xl p-8 max-w-3xl mx-auto">
          <h3 className="text-center font-['Swiss 721 Black Extended BT'] text-3xl mb-8 text-[#ca5231]">
            HORAIRES DES CONCERTS
          </h3>
          <div className="space-y-4">
            {sortedProgram.map((concert) => (
              <div 
                key={concert.id}
                className="flex items-center justify-between p-4 hover:bg-white/30 rounded-lg transition-colors duration-300"
              >
                <div className="flex items-center space-x-4">
                  <Clock className="w-5 h-5 text-[#ca5231]" />
                  <span className="text-xl font-['Railroad Gothic'] text-[#ca5231]">
                    {concert.time}
                  </span>
                  <span className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231]">
                    {concert.title}
                  </span>
                </div>
                <span className="text-lg text-[#ca5231]/80 font-['Rainy Days']">
                  {concert.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;