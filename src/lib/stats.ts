import { supabase } from './supabase';

let geoLocationFailures = 0;
const MAX_FAILURES = 3;

const getLocationData = async (ip: string) => {
  if (geoLocationFailures >= MAX_FAILURES) {
    return null;
  }

  const APIs = [
    {
      url: `https://ipapi.co/${ip}/json/`,
      transform: (data: any) => ({
        country: data.country_name,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude
      })
    },
    {
      url: `https://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon`,
      transform: (data: any) => ({
        country: data.country,
        region: data.regionName,
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
        geoLocationFailures = 0;
        return api.transform(data);
      }
    } catch (error) {
      console.warn(`API de géolocalisation échouée: ${api.url}`, error);
      continue;
    }
  }

  geoLocationFailures++;
  console.warn(`Tentative de géolocalisation ${geoLocationFailures} sur ${MAX_FAILURES} échouée`);
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
      const ipResponse = await fetch('https://api.ipify.org?format=json', {
        signal: AbortSignal.timeout(5000)
      });
      
      if (!ipResponse.ok) {
        throw new Error(`Erreur HTTP! status: ${ipResponse.status}`);
      }
      
      const { ip } = await ipResponse.json();
      locationData = await getLocationData(ip);
    } catch (error) {
      console.warn('Erreur lors de la récupération de l\'IP ou des données de localisation:', error);
    }

    const { data, error } = await supabase
      .from('stats')
      .insert([{
        page_view: page,
        view_count: 1,
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
    console.error('Erreur lors du suivi de la page:', error);
    return null;
  }
};