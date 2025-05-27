import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Constants
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const BOT_PATTERNS = [
  /bot/i, /crawler/i, /spider/i, /googlebot/i, /bingbot/i, /yahoo/i,
  /baidu/i, /yandex/i, /duckduckbot/i
];

// Helper to check if user agent is a bot
const isBot = (userAgent: string): boolean => {
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
};

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  const lastActivity = sessionStorage.getItem('last_activity');
  const now = Date.now();

  // Check if session expired
  if (lastActivity && now - parseInt(lastActivity) > SESSION_DURATION) {
    sessionId = null;
  }

  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('session_id', sessionId);
  }

  sessionStorage.setItem('last_activity', now.toString());
  return sessionId;
};

// Get or create visitor ID
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

export const trackPageView = async (page: string) => {
  try {
    // Don't track bots
    if (isBot(navigator.userAgent)) {
      return null;
    }

    const sessionId = getSessionId();
    const visitorId = getVisitorId();
    const sessionStart = sessionStorage.getItem('session_start');
    const sessionDuration = sessionStart ? Math.floor((Date.now() - parseInt(sessionStart)) / 1000) : 0;

    if (!sessionStart) {
      sessionStorage.setItem('session_start', Date.now().toString());
    }

    // Get location data
    let locationData = null;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json', {
        signal: AbortSignal.timeout(5000)
      });
      
      if (!ipResponse.ok) {
        throw new Error(`HTTP error! status: ${ipResponse.status}`);
      }
      
      const { ip } = await ipResponse.json();
      
      // Try multiple geolocation services
      const geoResponse = await Promise.any([
        fetch(`https://ipapi.co/${ip}/json/`),
        fetch(`https://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon`)
      ]);

      if (geoResponse.ok) {
        const data = await geoResponse.json();
        locationData = {
          country: data.country || data.country_name,
          region: data.regionName || data.region,
          city: data.city,
          latitude: data.lat || data.latitude,
          longitude: data.lon || data.longitude
        };
      }
    } catch (error) {
      console.warn('Error getting location data:', error);
    }

    // Update session
    await supabase
      .from('sessions')
      .upsert({
        session_id: sessionId,
        first_seen: new Date().toISOString()
      }, {
        onConflict: 'session_id'
      });

    // Track page view
    const { data, error } = await supabase
      .from('stats')
      .insert([{
        page_view: page,
        view_count: 1,
        session_id: sessionId,
        visitor_id: visitorId,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        session_duration: sessionDuration,
        ...(locationData && {
          country: locationData.country,
          region: locationData.region,
          city: locationData.city,
          latitude: locationData.latitude,
          longitude: locationData.longitude
        })
      }]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking page view:', error);
    return null;
  }
};