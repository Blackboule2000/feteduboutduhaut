import React from 'react';

const FacebookFeed: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] mb-6 text-center">
        Suivez-nous sur Facebook !
      </h3>

      <div className="flex justify-center">
        <div
          className="fb-page"
          data-href="https://www.facebook.com/AssociationDuBoutDuHaut"
          data-tabs="timeline"
          data-width="800"
          data-height="400"
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
  );
};

export default FacebookFeed;