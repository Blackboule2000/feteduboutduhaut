import React, { useState, useEffect } from 'react';
import { Music, Bike, Star } from 'lucide-react';
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

  useEffect(() => {
    loadProgram();

    const channel = supabase
      .channel('program_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'program'
        },
        () => {
          loadProgram();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadProgram = async () => {
    try {
      const { data, error } = await supabase
        .from('program')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setProgram(data);
    } catch (err) {
      console.error('Erreur lors du chargement du programme:', err);
    } finally {
      setLoading(false);
    }
  };

  // Séparation des concerts par catégorie
  const mainConcerts = program.filter(concert => 
    concert.title === "MOTOLO" || concert.title === "ARBAS"
  ).sort((a, b) => a.title === "MOTOLO" ? -1 : 1);
  
  const otherConcerts = program.filter(concert => 
    concert.title !== "MOTOLO" && 
    concert.title !== "ARBAS" && 
    concert.title !== "Anna Rudy & Paul Lazarus"
  );
  
  const afterParty = program.find(concert => concert.title === "Anna Rudy & Paul Lazarus");

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
        ></iframe>
      </div>
    );
  };

  const ConcertCard = ({ concert, isMain = false }: { concert: Program, isMain?: boolean }) => (
    <div className={`relative group ${isMain ? 'transform hover:scale-102' : 'transform hover:scale-101'}`}>
      <div className="absolute inset-0 bg-[#ca5231]/20 blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
      <div className="concert-card bg-[#f6d9a0] rounded-xl overflow-hidden transform transition-all duration-500 hover:rotate-1 relative h-full">
        <div className="absolute inset-0 border-[12px] border-[#ca5231]/20 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-[12px] border-[3px] border-[#ca5231]/30 rounded-lg pointer-events-none"></div>
        
        <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-[#ca5231]/40 rounded-tl-xl"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-[#ca5231]/40 rounded-tr-xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-[#ca5231]/40 rounded-bl-xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-[#ca5231]/40 rounded-br-xl"></div>

        <div className="relative p-8 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="text-[#ca5231] text-2xl font-['Railroad Gothic'] bg-[#ca5231]/10 px-4 py-2 rounded-full">
              {concert.time}
            </div>
            <div className="flex items-center bg-[#ca5231]/10 px-4 py-2 rounded-full">
              {concert.stage === "Grande Scène" ? (
                <Star className="w-5 h-5 text-[#ca5231] mr-2" />
              ) : concert.stage === "Scène à Vélo" ? (
                <Bike className="w-5 h-5 text-[#ca5231] mr-2" />
              ) : (
                <Music className="w-5 h-5 text-[#ca5231] mr-2" />
              )}
              <span className="text-lg text-[#ca5231] font-['Railroad Gothic']">
                {concert.stage}
              </span>
            </div>
          </div>

          {concert.image_url && (
            <div className="relative aspect-video mb-6 overflow-hidden rounded-xl shadow-xl">
              <div className="absolute inset-0 bg-[#ca5231]/10"></div>
              <img 
                src={concert.image_url} 
                alt={concert.title}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          )}

          <h3 className={`font-['Swiss 721 Black Extended BT'] ${isMain ? 'text-4xl' : 'text-3xl'} text-[#ca5231] mb-4 text-center`}>
            {concert.title}
          </h3>

          <p className="font-['Rainy Days'] text-[#ca5231]/80 mb-6 text-xl text-center flex-grow">
            {concert.description}
          </p>

          <div className="mt-auto">
            <AudioPlayer url={concert.audio_url || null} />
            <VideoPlayer url={concert.video_url} />
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
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 mb-16">
          {mainConcerts.map((concert) => (
            <div key={concert.id} className="flex-1 min-w-0 max-w-[600px]">
              <ConcertCard concert={concert} isMain={true} />
            </div>
          ))}
        </div>

        {/* Autres concerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {otherConcerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </div>

        {/* After party */}
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
            <ConcertCard concert={afterParty} />
          </div>
        )}
        
        {/* Programme horaire */}
        <div className="mt-16 bg-[#f6d9a0]/90 backdrop-blur-sm rounded-xl p-8 text-center max-w-3xl mx-auto transform hover:rotate-1 transition-transform duration-300">
          <h3 className="font-['Swiss 721 Black Extended BT'] text-3xl mb-8 text-[#ca5231]">HORAIRES DES CONCERTS</h3>
          <div className="space-y-4">
            {program.map((concert) => (
              <div key={concert.id} className="flex justify-between items-center p-4 hover:bg-white/30 rounded-lg transition-colors duration-300">
                <span className="font-['Railroad Gothic'] text-[#ca5231] text-2xl">{concert.title}</span>
                <div className="flex items-center">
                  <span className="font-['Railroad Gothic'] text-festival-turquoise mr-4 text-2xl">{concert.time}</span>
                  <span className="text-lg text-[#ca5231]/80 font-['Rainy Days'] italic">({concert.stage})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;