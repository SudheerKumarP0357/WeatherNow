import axios from 'axios';
import { Location, WeatherData, LocationSuggestion } from '../types';
// In a production environment, this would be handled securely through environment variables
// and a backend proxy to protect the API key
// Get API key from environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!API_KEY) {
  throw new Error('OpenWeather API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file.');
}
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
  },
});

const geoApi = axios.create({
  baseURL: GEO_URL,
  params: {
    appid: API_KEY,
  },
});

export async function fetchWeatherByCoordinates(
  lat: number, 
  lon: number, 
  units: 'metric' | 'imperial' = 'metric'
): Promise<WeatherData> {
  try {
    // Get current weather
    const currentResponse = await weatherApi.get('/weather', {
      params: {
        lat,
        lon,
        units,
      },
    });

    // Get 5-day forecast with 3-hour intervals
    const forecastResponse = await weatherApi.get('/forecast', {
      params: {
        lat,
        lon,
        units,
      },
    });
    
    // Transform the API responses to our WeatherData type
    return transformWeatherData(currentResponse.data, forecastResponse.data, { lat, lon, name: currentResponse.data.name, country: currentResponse.data.sys.country });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
}

export async function fetchWeatherByLocationId(
  locationId: string,
  units: 'metric' | 'imperial' = 'metric'
): Promise<WeatherData> {
  try {
    // First, get location details from local storage or another source
    const location = await getLocationById(locationId);
    
    if (!location) {
      throw new Error('Location not found');
    }
    
    return fetchWeatherByCoordinates(location.lat, location.lon, units);
  } catch (error) {
    console.error('Error fetching weather by location ID:', error);
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
}

export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  try {
    const response = await geoApi.get('/direct', {
      params: {
        q: query,
        limit: 5,
      },
    });
    
    return response.data.map((item: any) => ({
      id: `${item.lat}_${item.lon}`,
      name: item.name,
      state: item.state,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw new Error('Failed to search locations. Please try again later.');
  }
}

export async function getLocationByCoordinates(lat: number, lon: number): Promise<Location> {
  try {
    // Create the request without relying on axios instance params to avoid URL encoding issues
    const response = await axios.get(`${GEO_URL}/reverse`, {
      params: {
        appid: API_KEY,
        lat,
        lon,
        limit: 1,
      },
    });
    
    const location = response.data[0];
    return {
      id: `${lat}_${lon}`,
      name: location.name,
      state: location.state,
      country: location.country,
      lat,
      lon,
    };
  } catch (error) {
    console.error('Error getting location by coordinates:', error);
    throw new Error('Failed to get location. Please try again later.');
  }
}

// Mock function for demo purposes - in real app, this would get data from a database
async function getLocationById(locationId: string): Promise<Location | null> {
  // Parse the ID which is in format "lat_lon"
  const [lat, lon] = locationId.split('_').map(Number);
  
  if (isNaN(lat) || isNaN(lon)) {
    return null;
  }
  
  try {
    return await getLocationByCoordinates(lat, lon);
  } catch (error) {
    console.error('Error getting location by ID:', error);
    return null;
  }
}

// Helper function to transform the OpenWeatherMap API response to our WeatherData type
function transformWeatherData(currentData: any, forecastData: any, location: Partial<Location>): WeatherData {
  // Get sunrise/sunset times from current weather data
  const sunrise = new Date(currentData.sys.sunrise * 1000).toISOString();
  const sunset = new Date(currentData.sys.sunset * 1000).toISOString();

  // Transform 3-hour forecast data into daily forecasts
  const dailyForecasts = new Map();
  
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!dailyForecasts.has(dateKey)) {
      dailyForecasts.set(dateKey, {
        date: date.toISOString(),
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min,
        weather_condition: {
          id: item.weather[0].id,
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        },
        precipitation_probability: item.pop * 100,
        sunrise,
        sunset,
        summary: `Expect ${item.weather[0].description} conditions.`,
      });
    } else {
      const existing = dailyForecasts.get(dateKey);
      existing.temp_max = Math.max(existing.temp_max, item.main.temp_max);
      existing.temp_min = Math.min(existing.temp_min, item.main.temp_min);
    }
  });

  return {
    current: {
      temp: currentData.main.temp,
      feels_like: currentData.main.feels_like,
      humidity: currentData.main.humidity,
      wind_speed: currentData.wind.speed,
      wind_direction: currentData.wind.deg,
      pressure: currentData.main.pressure,
      uv_index: currentData.uvi || 0,
      visibility: currentData.visibility,
      weather_condition: {
        id: currentData.weather[0].id,
        main: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
      },
      datetime: new Date(currentData.dt * 1000).toISOString(),
      sunrise,
      sunset,
    },
    daily: Array.from(dailyForecasts.values()),
    location: {
      id: `${location.lat}_${location.lon}`,
      name: location.name || 'Unknown',
      country: location.country || '',
      state: location.state,
      lat: location.lat!,
      lon: location.lon!,
    },
  };
}