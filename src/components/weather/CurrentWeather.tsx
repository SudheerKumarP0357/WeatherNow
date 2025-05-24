import { Cloud, CloudRain, CloudSnow, CloudSun, Droplets, Sun, Wind, ThermometerSun, Cloudy } from 'lucide-react';
import { CurrentWeather as CurrentWeatherType } from '../../types';
import { formatTemperature, formatTime, getWeatherIconName, getWindDirection } from '../../utils/helpers';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  city: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
}

export default function CurrentWeather({ data, city, temperatureUnit }: CurrentWeatherProps) {
  const weatherIconName = getWeatherIconName(data.weather_condition);
  
  // Dynamically render the weather icon based on the condition
  const renderWeatherIcon = () => {
    switch (weatherIconName) {
      case 'sun':
        return <Sun className="h-24 w-24 text-yellow-500 sun-pulse" aria-hidden="true" />;
      case 'cloud-sun':
        return <CloudSun className="h-24 w-24 text-gray-500 cloud-float" aria-hidden="true" />;
      case 'cloud':
        return <Cloud className="h-24 w-24 text-gray-500 cloud-float" aria-hidden="true" />;
      case 'cloud-rain':
        return <CloudRain className="h-24 w-24 text-gray-500 rain-drop" aria-hidden="true" />;
      case 'cloud-snow':
        return <CloudSnow className="h-24 w-24 text-gray-300 snow-fall" aria-hidden="true" />;
      case 'cloud-fog':
        return <Cloudy className="h-24 w-24 text-gray-400" aria-hidden="true" />;
      default:
        return <Sun className="h-24 w-24 text-yellow-500" aria-hidden="true" />;
    }
  };
  
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{city}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Updated: {formatTime(data.datetime, { hour: 'numeric', minute: 'numeric' })}
          </p>
          <div className="mt-2">
            <p className="text-5xl font-bold text-gray-800 dark:text-white">
              {formatTemperature(data.temp, temperatureUnit)}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg capitalize">
              {data.weather_condition.description}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Feels like {formatTemperature(data.feels_like, temperatureUnit)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          {renderWeatherIcon()}
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center">
          <Wind className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Wind</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {Math.round(data.wind_speed)} km/h {getWindDirection(data.wind_direction)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Droplets className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <ThermometerSun className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">UV Index</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{Math.round(data.uv_index)}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sunrise/Sunset</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {formatTime(data.sunrise)} / {formatTime(data.sunset)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}