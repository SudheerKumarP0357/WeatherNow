import { useState } from 'react';
import { Cloud, CloudRain, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import useWeather from '../hooks/useWeather';
import LocationSearch from '../components/weather/LocationSearch';
import CurrentWeather from '../components/weather/CurrentWeather';
import DailyForecast from '../components/weather/DailyForecast';
import WeatherAlerts from '../components/weather/WeatherAlerts';
import TemperatureUnitToggle from '../components/weather/TemperatureUnitToggle';

export default function HomePage() {
  const { user } = useAuth();
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>(
    user?.preferences.temperatureUnit || 'celsius'
  );
  
  const { weatherData, loading, error, refreshWeather } = useWeather();
  
  const handleUnitChange = (unit: 'celsius' | 'fahrenheit') => {
    setTemperatureUnit(unit);
    refreshWeather();
  };
  
  // Render loading state
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
  
  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-error-50 dark:bg-error-900/30 p-6 rounded-lg text-center">
            <CloudRain className="h-16 w-16 mx-auto mb-4 text-error-500" />
            <h2 className="text-xl font-semibold text-error-800 dark:text-error-200 mb-2">
              Error Loading Weather Data
            </h2>
            <p className="text-error-600 dark:text-error-300 mb-4">{error}</p>
            <button
              onClick={refreshWeather}
              className="px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center">
            <Sun className="h-8 w-8 text-yellow-500 mr-2 hidden sm:block" />
            WeatherNow
            <Cloud className="h-8 w-8 text-primary-500 ml-2 hidden sm:block" />
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get real-time weather updates and forecasts for any location around the world. 
            Search for a city or use your current location to get started.
          </p>
        </div>
        
        <div className="mb-8">
          <LocationSearch />
        </div>
        
        {weatherData && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <TemperatureUnitToggle 
                unit={temperatureUnit} 
                onChange={handleUnitChange} 
              />
            </div>
            
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
        )}
        
        {!weatherData && !loading && !error && (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Cloud className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No Weather Data Available
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Search for a location or use your current location to get weather information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}