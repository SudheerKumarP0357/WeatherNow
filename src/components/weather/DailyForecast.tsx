import { DailyForecast as DailyForecastType } from '../../types';
import { formatDate, formatTemperature, getWeatherIconName } from '../../utils/helpers';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudSun } from 'lucide-react';

interface DailyForecastProps {
  data: DailyForecastType[];
  temperatureUnit: 'celsius' | 'fahrenheit';
}

export default function DailyForecast({ data, temperatureUnit }: DailyForecastProps) {
  // Render weather icon based on condition
  const renderWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="h-8 w-8 text-yellow-500" aria-hidden="true" />;
      case 'cloud-sun':
        return <CloudSun className="h-8 w-8 text-gray-500" aria-hidden="true" />;
      case 'cloud':
        return <Cloud className="h-8 w-8 text-gray-500" aria-hidden="true" />;
      case 'cloud-rain':
        return <CloudRain className="h-8 w-8 text-gray-500" aria-hidden="true" />;
      case 'cloud-snow':
        return <CloudSnow className="h-8 w-8 text-gray-300" aria-hidden="true" />;
      case 'cloud-lightning':
        return <CloudLightning className="h-8 w-8 text-gray-500" aria-hidden="true" />;
      case 'cloud-fog':
        return <CloudFog className="h-8 w-8 text-gray-400" aria-hidden="true" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" aria-hidden="true" />;
    }
  };
  
  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">5-Day Forecast</h3>
      
      <div className="space-y-4">
        {data.slice(0, 5).map((day, index) => (
          <div 
            key={index}
            className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div className="flex items-center">
              <div className="w-20">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {index === 0 ? 'Today' : formatDate(day.date, { weekday: 'short' })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(day.date, { month: 'short', day: 'numeric' })}
                </p>
              </div>
              
              <div className="ml-2">
                {renderWeatherIcon(getWeatherIconName(day.weather_condition))}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-right mr-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Precip</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {Math.round(day.precipitation_probability)}%
                </p>
              </div>
              
              <div className="text-right w-20">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {formatTemperature(day.temp_max, temperatureUnit)} / {formatTemperature(day.temp_min, temperatureUnit)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                  {day.weather_condition.main}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}