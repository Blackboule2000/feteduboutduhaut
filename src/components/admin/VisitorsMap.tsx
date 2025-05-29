import React from 'react';
import { MapPin, Users, CalendarDays } from 'lucide-react';

const VisitorsMap = () => {
  return (
    <>
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <MapPin className="inline-block mr-2" size={20} />
            Visiteurs par Pays
          </h3>
          <div className="h-64 bg-gray-200 rounded-md">
            {/* Placeholder for the map */}
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-1">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <Users className="inline-block mr-2" size={20} />
            Total des Visiteurs
          </h3>
          <p className="text-3xl font-bold text-green-600">1,234</p>
          <p className="text-sm text-gray-500 mt-2">
            Depuis le début du mois
          </p>
        </div>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-1">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <CalendarDays className="inline-block mr-2" size={20} />
            Visites Aujourd'hui
          </h3>
          <p className="text-3xl font-bold text-blue-600">567</p>
          <p className="text-sm text-gray-500 mt-2">
            Mise à jour il y a 5 minutes
          </p>
        </div>
      </div>
    </>
  );
};

export default VisitorsMap;
