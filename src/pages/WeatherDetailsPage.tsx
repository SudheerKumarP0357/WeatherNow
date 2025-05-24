import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FavoriteLocation, WeatherData } from '../types';
import { addFavoriteLocation, removeFavoriteLocation, getFavoriteLocations } from '../utils/storage';
import { fetchWeatherByLocationId, fetchWeatherByCoordinates } from '../utils/api';
import CurrentWeather from '../components/weather/CurrentWeather';
import DailyForecast from '../components/weather/DailyForecast';
import WeatherAlerts from '../components/weather/WeatherAlerts';
import TemperatureUnitToggle from '../components/weather/TemperatureUnitToggle';
import { getWeatherBackgroundClass } from '../utils/helpers';

export default function WeatherDetailsPage() {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>(
    user?.preferences.temperatureUnit || 'celsius'
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if location is in favorites
  useEffect(() => {
    const favoriteLocations = getFavoriteLocations();
    setIsFavorite(favoriteLocations.some(loc => loc.id === cityId));
  }, [cityId]);
  
  // Fetch weather data based on cityId
  useEffect(() => {
    if (!cityId) {
      // If no cityId is provided, try to get current location
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setLoading(true);
            setError(null);
            try {
              const data = await fetchWeatherByCoordinates(
                position.coords.latitude,
                position.coords.longitude,
                temperatureUnit === 'celsius' ? 'metric' : 'imperial'
              );
              setWeatherData(data);
            } catch (err) {
              console.error('Error fetching weather data:', err);
              setError('Failed to load weather data. Please try again.');
            } finally {
              setLoading(false);
            }
          },
          (err) => {
            console.error('Geolocation error:', err);
            setError('Please enable location access or search for a specific city.');
            navigate('/');
          }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
        navigate('/');
      }
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchWeatherByLocationId(
          cityId,
          temperatureUnit === 'celsius' ? 'metric' : 'imperial'
        );
        setWeatherData(data);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to load weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cityId, navigate, temperatureUnit]);
  
  // Toggle favorite status
  const toggleFavorite = () => {
    if (!weatherData) return;
    
    if (isFavorite) {
      removeFavoriteLocation(cityId!);
    } else {
      const favoriteLocation: FavoriteLocation = {
        id: cityId!,
        name: weatherData.location.name,
        state: weatherData.location.state,
        country: weatherData.location.country,
        addedAt: new Date().toISOString(),
      };
      
      addFavoriteLocation(favoriteLocation);
    }
    
    setIsFavorite(!isFavorite);
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    if (isRefreshing || !weatherData) return;

    setIsRefreshing(true);

    try {
      const data = await fetchWeatherByLocationId(
        weatherData.location.id,
        temperatureUnit === 'celsius' ? 'metric' : 'imperial'
      );
      setWeatherData(data);
    } catch (err) {
      console.error('Error refreshing weather data:', err);
      setError('Failed to refresh weather data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle share
  const handleShare = async () => {
    if (!weatherData) return;
    
    const shareText = `Check out the weather in ${weatherData.location.name}: ${weatherData.current.temp}°${temperatureUnit === 'celsius' ? 'C' : 'F'}, ${weatherData.current.weather_condition.description}`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WeatherNow Forecast',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };
  
  const handleUnitChange = (unit: 'celsius' | 'fahrenheit') => {
    setTemperatureUnit(unit);
  };
  
  // Get background class based on weather condition
  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-gradient-to-br from-blue-400 to-blue-600';
    
    return getWeatherBackgroundClass(weatherData.current.weather_condition);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading weather data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
          </div>
          
          <div className="bg-error-50 dark:bg-error-900/30 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-error-800 dark:text-error-200 mb-2">
              Error Loading Weather Data
            </h2>
            <p className="text-error-600 dark:text-error-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!weatherData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No Weather Data Available
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The requested location could not be found.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen transition-all duration-500 ${getBackgroundClass()}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white hover:text-gray-200"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            
            <div className="flex items-center space-x-3">
              <TemperatureUnitToggle 
                unit={temperatureUnit} 
                onChange={handleUnitChange} 
              />
              
              <button
                onClick={handleRefresh}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full"
                aria-label="Refresh weather data"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full"
                aria-label="Share weather information"
              >
                <Share2 className="h-5 w-5" />
              </button>
              
              <button
                onClick={toggleFavorite}
                className={`p-2 ${isFavorite ? 'bg-error-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'} rounded-full`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <CurrentWeather 
              data={weatherData.current} 
              city={weatherData.location.name} 
              temperatureUnit={temperatureUnit}
            />
                        
            <DailyForecast 
              data={weatherData.daily} 
              temperatureUnit={temperatureUnit}
            />
            
            {weatherData.alerts && weatherData.alerts.length > 0 && (
              <WeatherAlerts alerts={weatherData.alerts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}