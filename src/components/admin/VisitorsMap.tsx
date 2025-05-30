import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Users, Globe, Clock } from 'lucide-react';

interface VisitorLocation {
  city: string;
  region: string;
  country: string;
  count: number;
  coordinates: [number, number];
}

interface PageViewData {
  page: string;
  views: number;
}

interface DeviceData {
  device: string;
  count: number;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

const COLORS = ['#ca5231', '#f6d9a0', '#365d66', '#8B4513', '#6B8E23'];

const VisitorsMap: React.FC = () => {
  const [locations, setLocations] = useState<VisitorLocation[]>([]);
  const [pageViews, setPageViews] = useState<PageViewData[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);
  const [dailyStats, setDailyStats] = useState<{ date: string; visits: number }[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([]);
  const [averageSessionDuration, setAverageSessionDuration] = useState(0);

  useEffect(() => {
    loadStatistics();
    const interval = setInterval(loadStatistics, 60000); // Actualisation toutes les minutes
    return () => clearInterval(interval);
  }, []);

  const loadStatistics = async () => {
    try {
      // Charger les messages non lus
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (messages) {
        setUnreadMessages(messages);
      }

      // Charger les données de localisation
      const { data: locationData } = await supabase
        .from('stats')
        .select('city, region, country, latitude, longitude, view_count, session_duration')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (locationData) {
        // Calculer la durée moyenne des sessions
        const totalDuration = locationData.reduce((sum, curr) => sum + (curr.session_duration || 0), 0);
        const avgDuration = totalDuration / locationData.length || 0;
        setAverageSessionDuration(Math.round(avgDuration));

        // Agréger les données de localisation
        const locationMap = locationData.reduce((acc: Record<string, VisitorLocation>, curr) => {
          const key = `${curr.latitude}-${curr.longitude}`;
          if (!acc[key]) {
            acc[key] = {
              city: curr.city || 'Inconnue',
              region: curr.region || 'Inconnue',
              country: curr.country || 'Inconnue',
              count: 0,
              coordinates: [curr.latitude, curr.longitude]
            };
          }
          acc[key].count += curr.view_count || 1;
          return acc;
        }, {});

        const locations = Object.values(locationMap);
        setLocations(locations);
        setTotalVisits(locations.reduce((sum, loc) => sum + loc.count, 0));
      }

      // Charger les statistiques par page
      const { data: pageData } = await supabase
        .from('stats')
        .select('page_view, view_count')
        .order('created_at', { ascending: false });

      if (pageData) {
        const pageStats = pageData.reduce((acc: Record<string, number>, curr) => {
          const page = curr.page_view.replace('/', '') || 'Accueil';
          acc[page] = (acc[page] || 0) + (curr.view_count || 1);
          return acc;
        }, {});

        setPageViews(Object.entries(pageStats).map(([page, views]) => ({
          page: page.charAt(0).toUpperCase() + page.slice(1),
          views
        })));
      }

      // Charger les statistiques par appareil
      const { data: deviceData } = await supabase
        .from('stats')
        .select('user_agent, view_count')
        .order('created_at', { ascending: false });

      if (deviceData) {
        const deviceStats = deviceData.reduce((acc: Record<string, number>, curr) => {
          const device = curr.user_agent?.includes('Mobile') ? 'Mobile' : 'Desktop';
          acc[device] = (acc[device] || 0) + (curr.view_count || 1);
          return acc;
        }, {});

        setDeviceStats(Object.entries(deviceStats).map(([device, count]) => ({
          device,
          count
        })));
      }

      // Charger les statistiques quotidiennes
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: dailyData } = await supabase
        .from('stats')
        .select('created_at, view_count')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (dailyData) {
        const dailyStats = dailyData.reduce((acc: Record<string, number>, curr) => {
          const date = new Date(curr.created_at).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit'
          });
          acc[date] = (acc[date] || 0) + (curr.view_count || 1);
          return acc;
        }, {});

        setDailyStats(Object.entries(dailyStats).map(([date, visits]) => ({
          date,
          visits
        })));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg bg-gray-50 flex items-center justify-center">
        <div className="text-yellow-600">Chargement des statistiques...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-yellow-900">Visites totales</h3>
            <Users className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{totalVisits}</p>
          <p className="text-sm text-gray-500 mt-1">Depuis le début</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-yellow-900">Messages non lus</h3>
            <MessageSquare className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{unreadMessages.length}</p>
          <p className="text-sm text-gray-500 mt-1">À traiter</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-yellow-900">Pays différents</h3>
            <Globe className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {new Set(locations.map(loc => loc.country)).size}
          </p>
          <p className="text-sm text-gray-500 mt-1">Visiteurs internationaux</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-yellow-900">Durée moyenne</h3>
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {formatDuration(averageSessionDuration)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Par session</p>
        </div>
      </div>

      {/* Messages non lus */}
      {unreadMessages.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Derniers messages non lus</h3>
          <div className="space-y-4">
            {unreadMessages.map((message) => (
              <div key={message.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-yellow-900">{message.name}</h4>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(message.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{message.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carte des visiteurs */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">Carte des visiteurs</h3>
        <div className="h-[400px] relative">
          <MapContainer
            center={[46.603354, 1.888334]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.map((location, index) => (
              <CircleMarker
                key={index}
                center={location.coordinates}
                radius={Math.sqrt(location.count) * 5}
                fillColor="#ca5231"
                color="#ca5231"
                weight={1}
                opacity={0.8}
                fillOpacity={0.4}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{location.city}</p>
                    <p>{location.region}, {location.country}</p>
                    <p className="mt-1">
                      {location.count} visite{location.count > 1 ? 's' : ''}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statistiques par page */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Visites par page</h3>
          <div className="h-[300px]">
            <BarChart
              width={500}
              height={300}
              data={pageViews}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#ca5231" />
            </BarChart>
          </div>
        </div>

        {/* Répartition Mobile/Desktop */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Répartition Mobile/Desktop</h3>
          <div className="h-[300px] flex items-center justify-center">
            <PieChart width={400} height={300}>
              <Pie
                data={deviceStats}
                cx={200}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {deviceStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* Évolution des visites */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Évolution des visites</h3>
          <div className="h-[300px]">
            <LineChart
              width={1000}
              height={300}
              data={dailyStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visits" 
                stroke="#ca5231" 
                strokeWidth={2}
                dot={{ fill: '#ca5231' }}
              />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorsMap;