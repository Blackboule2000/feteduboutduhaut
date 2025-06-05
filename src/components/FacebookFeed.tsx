import React, { useEffect } from 'react';

const FacebookFeed: React.FC = () => {
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-[#ca5231]/20 blur-xl transform group-hover:scale-105 transition-transform duration-500"></div>
      <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg transform transition-all duration-500 hover:rotate-1">
        <div className="absolute inset-0 border-[8px] border-[#ca5231]/20 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-[8px] border-[2px] border-[#ca5231]/30 rounded-lg pointer-events-none"></div>

        <h3 className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] mb-6 text-center">
          Suivez-nous sur Facebook !
        </h3>

        <div className="flex justify-center">
          <div
            className="fb-page"
            data-href="https://www.facebook.com/AssociationDuBoutDuHaut"
            data-tabs="timeline"
            data-width="500"
            data-height="600"
            data-small-header="false"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="true"
          >
            <blockquote cite="https://www.facebook.com/AssociationDuBoutDuHaut" className="fb-xfbml-parse-ignore">
              <a href="https://www.facebook.com/AssociationDuBoutDuHaut">Association du Bout du Haut</a>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookFeed;