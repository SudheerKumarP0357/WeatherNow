import { useState, useRef } from 'react';
import { HourlyForecast as HourlyForecastType } from '../../types';
import { formatTime, formatTemperature, getWeatherIconName } from '../../utils/helpers';
import { ChevronLeft, ChevronRight, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudSun } from 'lucide-react';

interface HourlyForecastProps {
  data: HourlyForecastType[];
  temperatureUnit: 'celsius' | 'fahrenheit';
}

export default function HourlyForecast({ data, temperatureUnit }: HourlyForecastProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Scroll the container horizontally
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      const scrollAmount = 200; // Adjust as needed
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
      
      // Update arrow visibility after scrolling
      setTimeout(() => {
        if (container) {
          setShowLeftArrow(container.scrollLeft > 0);
          setShowRightArrow(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 10
          );
        }
      }, 300);
    }
  };
  
  // Handle scroll events to update arrow visibility
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };
  
  // Render weather icon based on condition
  const renderWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="h-6 w-6 text-yellow-500" aria-hidden="true" />;
      case 'cloud-sun':
        return <CloudSun className="h-6 w-6 text-gray-500" aria-hidden="true" />;
      case 'cloud':
        return <Cloud className="h-6 w-6 text-gray-500" aria-hidden="true" />;
      case 'cloud-rain':
        return <CloudRain className="h-6 w-6 text-gray-500" aria-hidden="true" />;
      case 'cloud-snow':
        return <CloudSnow className="h-6 w-6 text-gray-300" aria-hidden="true" />;
      case 'cloud-lightning':
        return <CloudLightning className="h-6 w-6 text-gray-500" aria-hidden="true" />;
      case 'cloud-fog':
        return <CloudFog className="h-6 w-6 text-gray-400" aria-hidden="true" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" aria-hidden="true" />;
    }
  };
  
  return (
    <div className="glass-card p-6 animate-fade-in relative">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Hourly Forecast</h3>
      
      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 p-1 rounded-full shadow-md text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 p-1 rounded-full shadow-md text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide py-2 space-x-6"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {data.map((hour, index) => (
            <div key={index} className="flex flex-col items-center min-w-[60px]">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                {index === 0 ? 'Now' : formatTime(hour.datetime, { hour: 'numeric' })}
              </p>
              <div className="my-1">
                {renderWeatherIcon(getWeatherIconName(hour.weather_condition))}
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {formatTemperature(hour.temp, temperatureUnit)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {Math.round(hour.precipitation_probability)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}