import { useState, useEffect } from 'react';
import { WeatherData, Location, LocationErrorType } from '../types';
import { fetchWeatherByCoordinates, getLocationByCoordinates } from '../utils/api';
import { getUserPreferences } from '../utils/storage';
import { getCurrentPosition } from '../utils/helpers';


interface UseWeatherOptions {
  lat?: number;
  lon?: number;
  locationId?: string;
  skipAutoLocation?: boolean;
}

interface UseWeatherResult {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  locationError: LocationErrorType; 
  refreshWeather: () => Promise<void>;
}

export default function useWeather(options: UseWeatherOptions = {}): UseWeatherResult {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<LocationErrorType>(null);
  
  const { lat, lon, locationId, skipAutoLocation } = options;
  
  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    setLocationError(null);
    
    try {
      const preferences = getUserPreferences();
      const units = preferences.temperatureUnit === 'celsius' ? 'metric' : 'imperial';
      
      // If coordinates are provided, fetch weather for those coordinates
      if (lat !== undefined && lon !== undefined) {
        const location = await getLocationByCoordinates(lat, lon);
        const data = await fetchWeatherByCoordinates(lat, lon, units);
        setWeatherData(data);
        return;
      }
      
      // If locationId is provided, we'd fetch weather for that location (implementation in api.ts)
      if (locationId) {
        // Implementation for fetching by location ID would go here
        // For now, we'll fall back to geolocation
      }
      
      // If no coordinates or locationId, try to use geolocation
      if (!skipAutoLocation) {
        try {
          const position = await getCurrentPosition();
          const { latitude, longitude } = position.coords;
          const location = await getLocationByCoordinates(latitude, longitude);
          const data = await fetchWeatherByCoordinates(latitude, longitude, units);
          setWeatherData(data);
        } catch (geoError) {
          if (geoError instanceof Error) {
            if (geoError.message.includes('denied')) {
              setLocationError('DENIED');
              throw new Error('Location access denied. Please enable location services or search for a specific city.');
            } else if (geoError.message.includes('timeout')) {
              setLocationError('TIMEOUT');
              throw new Error('Location request timed out. Please try again or search for a specific city.');
            } else if (geoError.message.includes('unavailable')) {
              setLocationError('UNAVAILABLE');
              throw new Error('Location services are not available. Please search for a specific city.');
            } else {
              setLocationError('UNKNOWN');
              throw new Error('An unexpected error occurred while getting your location.');
            }
          }
          setLocationError('UNKNOWN');
          throw geoError;
        }
      }
    } catch (err) {
      console.error('Error in useWeather:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching weather data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchWeather();
  }, [lat, lon, locationId]);
  
  const refreshWeather = async () => {
    await fetchWeather();
  };
  
  return { weatherData, loading, error,locationError, refreshWeather };
}