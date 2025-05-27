import React, { useEffect, useState, useRef } from 'react';
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
import { MessageSquare, Users, Globe, Clock, CheckCircle, XCircle, Calendar, Activity, Dices as Devices } from 'lucide-react';

// Register ChartJS components
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

const COLORS = ['#334155', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];
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
  const [pageViews, setPageViews] = useState<PageViewData[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);
  const [dailyStats, setDailyStats] = useState<{ date: string; visits: number }[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([]);
  const [readMessages, setReadMessages] = useState<ContactMessage[]>([]);
  const [averageSessionDuration, setAverageSessionDuration] = useState(0);
  const [peakHours, setPeakHours] = useState<{ hour: number; count: number }[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('visits');

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
        cornerRadius: 8,
        titleFont: {
          family: "'Inter', sans-serif",
          weight: '600',
          size: 14
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        }
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

  useEffect(() => {
    loadStatistics();
    const interval = setInterval(loadStatistics, 60000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const loadStatistics = async () => {
    try {
      setLoading(true);

      // Calculate date range
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
        case '90d':
          rangeStart.setDate(rangeStart.getDate() - 90);
          break;
      }

      // Load messages
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messages) {
        setUnreadMessages(messages.filter(msg => !msg.read));
        setReadMessages(messages.filter(msg => msg.read));
      }

      // Load statistics with date filter
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

        // Process page views
        const pageViewMap = stats.reduce((acc: Record<string, number>, curr) => {
          const page = curr.page_view.replace('/', '') || 'Home';
          acc[page] = (acc[page] || 0) + (curr.view_count || 1);
          return acc;
        }, {});

        setPageViews(Object.entries(pageViewMap).map(([page, views]) => ({
          page: page.charAt(0).toUpperCase() + page.slice(1),
          views
        })));

        // Process device stats
        const deviceMap = stats.reduce((acc: Record<string, number>, curr) => {
          const device = curr.user_agent?.includes('Mobile') ? 'Mobile' : 'Desktop';
          acc[device] = (acc[device] || 0) + (curr.view_count || 1);
          return acc;
        }, {});

        setDeviceStats(Object.entries(deviceMap).map(([device, count]) => ({
          device,
          count
        })));

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

        // Calculate average session duration
        const totalDuration = stats.reduce((sum, curr) => sum + (curr.session_duration || 0), 0);
        setAverageSessionDuration(Math.round(totalDuration / stats.length || 0));

        // Calculate peak hours
        const hourMap = stats.reduce((acc: Record<number, number>, curr) => {
          const hour = new Date(curr.created_at).getHours();
          acc[hour] = (acc[hour] || 0) + (curr.view_count || 1);
          return acc;
        }, {});

        setPeakHours(
          Object.entries(hourMap)
            .map(([hour, count]) => ({ hour: parseInt(hour), count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
        );
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
      await loadStatistics();
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700 flex items-center space-x-3">
          <div className="w-3 h-3 bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  const lineChartData = {
    labels: dailyStats.map(stat => stat.date),
    datasets: [
      {
        label: 'Visits',
        data: dailyStats.map(stat => stat.visits),
        borderColor: CHART_COLORS.primary,
        backgroundColor: `${CHART_COLORS.primary}20`,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const barChartData = {
    labels: pageViews.map(view => view.page),
    datasets: [
      {
        label: 'Page Views',
        data: pageViews.map(view => view.views),
        backgroundColor: CHART_COLORS.primary,
        borderRadius: 4
      }
    ]
  };

  const pieChartData = {
    labels: deviceStats.map(stat => stat.device),
    datasets: [
      {
        data: deviceStats.map(stat => stat.count),
        backgroundColor: COLORS,
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={() => loadStatistics()}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Visits</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{totalVisits}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Users className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>For selected period</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Messages</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div>
                    <p className="text-3xl font-semibold text-gray-900">{unreadMessages.length}</p>
                    <p className="text-xs text-gray-500">Unread</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-green-600">{readMessages.length}</p>
                    <p className="text-xs text-gray-500">Read</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <MessageSquare className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Countries</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                  {new Set(locations.map(loc => loc.country)).size}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Globe className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Activity className="w-4 h-4 mr-1" />
              <span>International reach</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Duration</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                  {formatDuration(averageSessionDuration)}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Clock className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Devices className="w-4 h-4 mr-1" />
              <span>Per session</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visits Evolution */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Visits Evolution</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                >
                  <option value="visits">Visits</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
            <div className="h-80">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          {/* Page Views */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Page Views</h3>
            <div className="h-80">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          {/* Device Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Distribution</h3>
            <div className="h-80">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>

          {/* Visitors Map */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Visitors Map</h3>
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
                          {location.count} visit{location.count > 1 ? 's' : ''}
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        {unreadMessages.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Unread Messages</h3>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {unreadMessages.length} new
              </span>
            </div>
            <div className="space-y-4">
              {unreadMessages.map((message) => (
                <div
                  key={message.id}
                  className="border-l-4 border-gray-700 pl-4 py-4 hover:bg-gray-50 transition-colors rounded-r-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{message.name}</h4>
                      <p className="text-sm text-gray-500">{message.email}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => markMessageAsRead(message.id)}
                        className="p-1.5 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{message.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorsMap;