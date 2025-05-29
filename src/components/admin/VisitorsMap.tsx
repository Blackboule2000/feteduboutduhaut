import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Users, Globe, Clock, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface VisitorLocation {
  city: string;
  region: string;
  country: string;
  count: number;
  coordinates: [number, number];
}

const CHART_COLORS = {
  primary: '#334155',
  secondary: '#64748b',
  accent: '#94a3b8',
  background: '#ffffff',
  border: '#e2e8f0',
  text: '#334155'
};

const VisitorsMap: React.FC = () => {
  const [locations, setLocations] = useState<VisitorLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);
  const [dailyStats, setDailyStats] = useState<{ date: string; visits: number }[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    loadStatistics();
    const interval = setInterval(loadStatistics, 60000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const loadStatistics = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const rangeStart = new Date();
      switch (selectedTimeRange) {
        case '24h':
          rangeStart.setHours(rangeStart.getHours() - 24);
          break;
        case '7d':
          rangeStart.setDate(rangeStart.getDate() - 7);
          break;
        case '30d':
          rangeStart.setDate(rangeStart.getDate() - 30);
          break;
      }

      const { data: stats } = await supabase
        .from('stats')
        .select('*')
        .gte('created_at', rangeStart.toISOString())
        .order('created_at', { ascending: true });

      if (stats) {
        // Process locations
        const locationMap = stats.reduce((acc: Record<string, VisitorLocation>, curr) => {
          if (curr.latitude && curr.longitude) {
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
          }
          return acc;
        }, {});

        setLocations(Object.values(locationMap));
        setTotalVisits(stats.reduce((sum, curr) => sum + (curr.view_count || 1), 0));

        // Process daily stats
        const dailyMap = stats.reduce((acc: Record<string, number>, curr) => {
          const date = new Date(curr.created_at).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit'
          });
          acc[date] = (acc[date] || 0) + (curr.view_count || 1);
          return acc;
        }, {});

        setDailyStats(Object.entries(dailyMap).map(([date, visits]) => ({
          date,
          visits
        })));
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700">Chargement des statistiques...</div>
      </div>
    );
  }

  const lineChartData = {
    labels: dailyStats.map(stat => stat.date),
    datasets: [
      {
        label: 'Visites',
        data: dailyStats.map(stat => stat.visits),
        borderColor: CHART_COLORS.primary,
        backgroundColor: `${CHART_COLORS.primary}20`,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: "'Inter', sans-serif",
            weight: '500'
          },
          color: CHART_COLORS.text
        }
      },
      tooltip: {
        backgroundColor: CHART_COLORS.background,
        titleColor: CHART_COLORS.text,
        bodyColor: CHART_COLORS.text,
        borderColor: CHART_COLORS.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          },
          color: CHART_COLORS.text
        }
      },
      y: {
        grid: {
          color: CHART_COLORS.border,
          drawBorder: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          },
          color: CHART_COLORS.text
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Statistiques des visites</h2>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm"
        >
          <option value="24h">Dernières 24 heures</option>
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total des visites</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{totalVisits}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pays</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">
                {new Set(locations.map(loc => loc.country)).size}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Globe className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution des visites</h3>
          <div className="h-80">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Carte des visiteurs</h3>
          <div className="h-80 rounded-lg overflow-hidden">
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
                  fillColor={CHART_COLORS.primary}
                  color={CHART_COLORS.primary}
                  weight={1}
                  opacity={0.8}
                  fillOpacity={0.4}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-medium">{location.city}</p>
                      <p className="text-gray-600">{location.region}, {location.country}</p>
                      <p className="mt-1 text-gray-700">
                        {location.count} visite{location.count > 1 ? 's' : ''}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorsMap;