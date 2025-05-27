import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Users, Globe, Clock, CheckCircle, XCircle, Calendar, Activity, Dices as Devices } from 'lucide-react';

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
  const [readMessages, setReadMessages] = useState<ContactMessage[]>([]);
  const [averageSessionDuration, setAverageSessionDuration] = useState(0);
  const [peakHours, setPeakHours] = useState<{ hour: number; count: number }[]>([]);

  useEffect(() => {
    loadStatistics();
    const interval = setInterval(loadStatistics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadStatistics = async () => {
    try {
      // Load all messages and separate read/unread
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messages) {
        setUnreadMessages(messages.filter(msg => !msg.read));
        setReadMessages(messages.filter(msg => msg.read));
      }

      // Load location data with timestamps
      const { data: locationData } = await supabase
        .from('stats')
        .select('city, region, country, latitude, longitude, view_count, session_duration, created_at')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (locationData) {
        // Calculate average session duration
        const totalDuration = locationData.reduce((sum, curr) => sum + (curr.session_duration || 0), 0);
        const avgDuration = totalDuration / locationData.length || 0;
        setAverageSessionDuration(Math.round(avgDuration));

        // Calculate peak hours
        const hourCounts = locationData.reduce((acc: Record<number, number>, curr) => {
          const hour = new Date(curr.created_at).getHours();
          acc[hour] = (acc[hour] || 0) + (curr.view_count || 1);
          return acc;
        }, {});

        setPeakHours(
          Object.entries(hourCounts)
            .map(([hour, count]) => ({ hour: parseInt(hour), count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
        );

        // Aggregate location data
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
        .select('page_view, view_count')
        .order('created_at', { ascending: false });

      if (pageData) {
        const pageStats = pageData.reduce((acc: Record<string, number>, curr) => {
          const page = curr.page_view.replace('/', '') || 'Home';
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

      // Load daily statistics
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
      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg bg-gray-50 flex items-center justify-center">
        <div className="text-[#ca5231]">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-102 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#ca5231]">Total Visits</h3>
            <div className="p-3 bg-[#ca5231]/10 rounded-full">
              <Users className="h-6 w-6 text-[#ca5231]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#ca5231] mb-2">{totalVisits}</p>
          <div className="flex items-center text-[#ca5231]/60">
            <Calendar className="h-4 w-4 mr-2" />
            <p className="text-sm">Since the beginning</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-102 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#ca5231]">Messages</h3>
            <div className="p-3 bg-[#ca5231]/10 rounded-full">
              <MessageSquare className="h-6 w-6 text-[#ca5231]" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-center text-[#ca5231] mb-1">
                <XCircle className="h-4 w-4 mr-2" />
                <p className="text-3xl font-bold">{unreadMessages.length}</p>
              </div>
              <p className="text-sm text-[#ca5231]/60">Unread</p>
            </div>
            <div>
              <div className="flex items-center text-green-500 mb-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                <p className="text-3xl font-bold">{readMessages.length}</p>
              </div>
              <p className="text-sm text-[#ca5231]/60">Read</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-102 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#ca5231]">Countries</h3>
            <div className="p-3 bg-[#ca5231]/10 rounded-full">
              <Globe className="h-6 w-6 text-[#ca5231]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#ca5231] mb-2">
            {new Set(locations.map(loc => loc.country)).size}
          </p>
          <div className="flex items-center text-[#ca5231]/60">
            <Activity className="h-4 w-4 mr-2" />
            <p className="text-sm">International reach</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-102 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#ca5231]">Avg. Duration</h3>
            <div className="p-3 bg-[#ca5231]/10 rounded-full">
              <Clock className="h-6 w-6 text-[#ca5231]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#ca5231] mb-2">
            {formatDuration(averageSessionDuration)}
          </p>
          <div className="flex items-center text-[#ca5231]/60">
            <Devices className="h-4 w-4 mr-2" />
            <p className="text-sm">Per session</p>
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#ca5231] flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Peak Hours
          </h3>
          <div className="p-2 bg-[#ca5231]/10 rounded-full">
            <Activity className="h-4 w-4 text-[#ca5231]" />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {peakHours.map(({ hour, count }) => (
            <div key={hour} className="bg-[#ca5231]/5 p-4 rounded-lg text-center hover:bg-[#ca5231]/10 transition-colors duration-300">
              <div className="text-2xl font-bold text-[#ca5231]">{hour}h</div>
              <div className="text-sm text-[#ca5231]/60">{count} visits</div>
            </div>
          ))}
        </div>
      </div>

      {/* Unread Messages */}
      {unreadMessages.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#ca5231] flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Unread Messages
            </h3>
            <span className="bg-[#ca5231] text-white px-3 py-1 rounded-full text-sm">
              {unreadMessages.length} new
            </span>
          </div>
          <div className="space-y-4">
            {unreadMessages.map((message) => (
              <div 
                key={message.id} 
                className="border-l-4 border-[#ca5231] pl-4 py-4 bg-[#ca5231]/5 rounded-r-lg hover:bg-[#ca5231]/10 transition-colors duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-[#ca5231] text-lg">{message.name}</h4>
                    <p className="text-sm text-[#ca5231]/60">{message.email}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-[#ca5231]/60">
                      {new Date(message.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <button
                      onClick={() => markMessageAsRead(message.id)}
                      className="p-2 bg-green-500/10 rounded-full hover:bg-green-500/20 transition-colors duration-300"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-[#ca5231]/80 line-clamp-2">{message.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visitors Map */}
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#ca5231] flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Visitors Map
          </h3>
          <div className="flex items-center space-x-2 text-[#ca5231]/60">
            <span className="text-sm">{locations.length} locations</span>
            <div className="w-2 h-2 rounded-full bg-[#ca5231] animate-pulse"></div>
          </div>
        </div>
        <div className="h-[400px] relative rounded-lg overflow-hidden">
          <MapContainer
            center={[46.603354, 1.888334]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
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
                      {location.count} visit{location.count > 1 ? 's' : ''}
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
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#ca5231] flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Visits by Page
            </h3>
          </div>
          <div className="h-[300px]">
            <BarChart
              width={500}
              height={300}
              data={pageViews}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ca523120" />
              <XAxis dataKey="page" stroke="#ca5231" />
              <YAxis stroke="#ca5231" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ca523120',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="views" fill="#ca5231" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>
        </div>

        {/* Mobile/Desktop Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#ca5231] flex items-center">
              <Devices className="h-5 w-5 mr-2" />
              Device Distribution
            </h3>
          </div>
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
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ca523120',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </div>
        </div>

        {/* Visits Evolution */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#ca5231] flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Visits Evolution
            </h3>
          </div>
          <div className="h-[300px]">
            <LineChart
              width={1000}
              height={300}
              data={dailyStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ca523120" />
              <XAxis dataKey="date" stroke="#ca5231" />
              <YAxis stroke="#ca5231" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ca523120',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visits" 
                stroke="#ca5231" 
                strokeWidth={2}
                dot={{ fill: '#ca5231' }}
                activeDot={{ r: 8, fill: '#ca5231' }}
              />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorsMap;