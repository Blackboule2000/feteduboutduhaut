import { supabase } from './supabase';

// Keep track of geolocation failures to prevent excessive retries
let geoLocationFailures = 0;
const MAX_FAILURES = 3;

const getLocationData = async (ip: string) => {
  // If we've had too many failures, skip geolocation
  if (geoLocationFailures >= MAX_FAILURES) {
    console.warn('Geolocation disabled due to repeated failures');
    return null;
  }

  const APIs = [
    {
      url: `https://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon`,
      transform: (data: any) => ({
        country: data.country,
        region: data.regionName,
        city: data.city,
        latitude: data.lat,
        longitude: data.lon
      })
    },
    {
      url: `https://extreme-ip-lookup.com/json/${ip}`,
      transform: (data: any) => ({
        country: data.country,
        region: data.region,
        city: data.city,
        latitude: data.lat,
        longitude: data.lon
      })
    }
  ];

  for (const api of APIs) {
    try {
      const response = await fetch(api.url, {
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success' || (data.country && data.city)) {
        // Reset failures counter on success
        geoLocationFailures = 0;
        return api.transform(data);
      }
    } catch (error) {
      console.warn(`Geolocation API failed: ${api.url}`, error);
      continue; // Try next API
    }
  }

  // If we get here, all APIs failed
  geoLocationFailures++;
  console.warn(`Geolocation attempt ${geoLocationFailures} of ${MAX_FAILURES} failed`);
  return null;
};

export const trackPageView = async (page: string) => {
  try {
    const sessionStart = sessionStorage.getItem('session_start');
    const sessionDuration = sessionStart ? Math.floor((Date.now() - parseInt(sessionStart)) / 1000) : 0;

    if (!sessionStart) {
      sessionStorage.setItem('session_start', Date.now().toString());
    }

    let locationData = null;
    try {
      // Get visitor's IP via HTTPS
      const ipResponse = await fetch('https://api.ipify.org?format=json', {
        signal: AbortSignal.timeout(5000)
      });
      
      if (!ipResponse.ok) {
        throw new Error(`HTTP error! status: ${ipResponse.status}`);
      }
      
      const { ip } = await ipResponse.json();
      locationData = await getLocationData(ip);
    } catch (error) {
      console.warn('Error getting IP or location data:', error);
      // Continue with the page view tracking even if geolocation fails
    }

    const { data, error } = await supabase
      .from('stats')
      .insert([{
        page_view: page,
        view_count: 1,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        session_duration: sessionDuration,
        // Only include location data if available
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