import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabase';

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

const COLORS = ['#ca5231', '#f6d9a0', '#365d66', '#8B4513', '#6B8E23'];

const VisitorsMap: React.FC = () => {
  const [locations, setLocations] = useState<VisitorLocation[]>([]);
  const [pageViews, setPageViews] = useState<PageViewData[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);
  const [dailyStats, setDailyStats] = useState<{ date: string; visits: number }[]>([]);

  useEffect(() => {
    loadStatistics();
    const interval = setInterval(loadStatistics, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const loadStatistics = async () => {
    try {
      // Load location data
      const { data: locationData } = await supabase
        .from('stats')
        .select('city, region, country, latitude, longitude, view_count')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (locationData) {
        const locationMap = locationData.reduce((acc: Record<string, VisitorLocation>, curr) => {
          const key = `${curr.latitude}-${curr.longitude}`;
          if (!acc[key]) {
            acc[key] = {
              city: curr.city || 'Unknown',
              region: curr.region || 'Unknown',
              country: curr.country || 'Unknown',
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

      // Load page statistics
      const { data: pageData } = await supabase
        .from('stats')
        .select('page_view, view_count');

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

      // Load device statistics
      const { data: deviceData } = await supabase
        .from('stats')
        .select('user_agent, view_count');

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

      // Load daily statistics
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: dailyData } = await supabase
        .from('stats')
        .select('created_at, view_count')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (dailyData) {
        const dailyStats = dailyData.reduce((acc: Record<string, number>, curr) => {
          const date = new Date(curr.created_at).toLocaleDateString();
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

  if (loading) {
    return (
      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg bg-gray-50 flex items-center justify-center">
        <div className="text-yellow-600">Chargement des statistiques...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* General Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Visites totales</h3>
          <p className="text-3xl font-bold text-yellow-600">{totalVisits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Pays différents</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {new Set(locations.map(loc => loc.country)).size}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Villes différentes</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {new Set(locations.map(loc => loc.city)).size}
          </p>
        </div>
      </div>

      {/* Visitors Map */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Page Statistics */}
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

        {/* Mobile/Desktop Distribution */}
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

        {/* Visits Evolution */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Évolution des visites</h3>
          <div className="h-[300px]">
            <BarChart
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
              <Bar dataKey="visits" fill="#365d66" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorsMap;