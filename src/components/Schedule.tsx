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

  // Artistes principaux (têtes d'affiche)
  const headliners = program.filter(concert => 
    concert.title === "MOTOLO" || concert.title === "Arbas"
  );

  // Autres concerts de la journée
  const dayConcerts = program.filter(concert => 
    concert.title !== "MOTOLO" && 
    concert.title !== "Arbas" && 
    concert.title !== "Anna Rudy & Paul Lazarus"
  ).sort((a, b) => {
    const timeA = parseInt(a.time.split(':')[0]);
    const timeB = parseInt(b.time.split(':')[0]);
    return timeA - timeB;
  });

  // After party
  const afterParty = program.find(concert => 
    concert.title === "Anna Rudy & Paul Lazarus"
  );

  const AudioPlayer = ({ url }: { url: string | null }) => {
    if (!url) return null;
    return (
      <div className="mt-4">
        <audio
          controls
          className="w-full h-12 rounded-lg"
          style={{
            backgroundColor: '#f6d9a0',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <source src={url} type="audio/mpeg" />
          Votre navigateur ne supporte pas la lecture audio.
        </audio>
      </div>
    );
  };

  const VideoPlayer = ({ url }: { url: string | undefined }) => {
    if (!url) return null;
    return (
      <div className="mt-4 aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src={url}
          title="Lecteur vidéo"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  };

  const TimelineItem = ({ time }: { time: string }) => {
    const isSelected = selectedTime === time;
    const concerts = program.filter(c => c.time === time);
    
    return (
      <div 
        className={`cursor-pointer transition-all duration-300 ${
          isSelected ? 'scale-105' : ''
        }`}
        onClick={() => setSelectedTime(isSelected ? null : time)}
      >
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-[#ca5231]" />
          <span className="text-lg font-['Railroad Gothic'] text-[#ca5231]">
            {time}
          </span>
        </div>
        {isSelected && (
          <div className="mt-2 space-y-2">
            {concerts.map(concert => (
              <div 
                key={concert.id}
                className="text-sm text-[#ca5231]/80 pl-7"
              >
                {concert.title} - {concert.stage}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <section id="programme" className="relative py-20 bg-festival-turquoise overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Chargement du programme...</div>
        </div>
      </section>
    );
  }

  const uniqueTimes = [...new Set(program.map(p => p.time))].sort((a, b) => {
    const timeA = parseInt(a.split(':')[0]);
    const timeB = parseInt(b.split(':')[0]);
    return timeA - timeB;
  });

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

        {/* Têtes d'affiche */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {headliners.map((concert, index) => (
            <div 
              key={concert.id}
              className={`transform transition-all duration-500 hover:scale-105 ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-[#ca5231]/20 blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
                <div className="bg-[#f6d9a0] rounded-xl overflow-hidden relative">
                  <div className="absolute inset-0 border-[12px] border-[#ca5231]/20 rounded-xl"></div>
                  
                  {concert.image_url && (
                    <div className="relative aspect-video overflow-hidden">
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
                          <span className="text-2xl text-white font-['Railroad Gothic']">
                            {concert.time}
                          </span>
                          <span className="text-xl text-white/80 font-['Rainy Days']">
                            {concert.stage}
                          </span>
                        </div>
                        <h3 className="text-4xl md:text-5xl text-white font-['Swiss 721 Black Extended BT'] mb-4">
                          {concert.title}
                        </h3>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <p className="text-xl text-[#ca5231]/80 font-['Rainy Days'] mb-6">
                      {concert.description}
                    </p>
                    <AudioPlayer url={concert.audio_url} />
                    <VideoPlayer url={concert.video_url} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Programme de la journée */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {dayConcerts.map((concert) => (
            <div 
              key={concert.id}
              className="transform transition-all duration-500 hover:scale-102"
            >
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
                    
                    <AudioPlayer url={concert.audio_url} />
                    <VideoPlayer url={concert.video_url} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* After Party */}
        {afterParty && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="font-['Swiss 721 Black Extended BT'] text-3xl text-[#f6d9a0] mb-2">
                AFTER PARTY
              </h3>
              <p className="text-xl text-[#f6d9a0]/90 font-['Rainy Days']">
                Pour continuer la fête jusqu'au bout de la nuit
              </p>
            </div>
            
            <div className="relative group transform transition-all duration-500 hover:scale-102">
              <div className="absolute inset-0 bg-[#ca5231]/20 blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
              <div className="bg-[#f6d9a0] rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 border-[8px] border-[#ca5231]/20 rounded-xl"></div>
                
                {afterParty.image_url && (
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={afterParty.image_url}
                      alt={afterParty.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Music className="h-5 w-5 text-[#ca5231]" />
                      <span className="text-lg font-['Railroad Gothic'] text-[#ca5231]">
                        {afterParty.time}
                      </span>
                    </div>
                    <span className="text-sm font-['Rainy Days'] text-[#ca5231]/80">
                      {afterParty.stage}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] mb-4">
                    {afterParty.title}
                  </h3>
                  
                  <p className="text-lg text-[#ca5231]/80 font-['Rainy Days'] mb-6">
                    {afterParty.description}
                  </p>
                  
                  <AudioPlayer url={afterParty.audio_url} />
                  <VideoPlayer url={afterParty.video_url} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-16 bg-[#f6d9a0]/90 backdrop-blur-sm rounded-xl p-8 max-w-3xl mx-auto">
          <h3 className="text-center font-['Swiss 721 Black Extended BT'] text-3xl mb-8 text-[#ca5231]">
            HORAIRES DES CONCERTS
          </h3>
          <div className="space-y-6">
            {uniqueTimes.map((time) => (
              <TimelineItem key={time} time={time} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;