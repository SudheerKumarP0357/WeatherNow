import { WeatherCondition } from '../types';

// Format temperature based on the selected unit
export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit'): string {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
}

// Format date to display in a readable format
export function formatDate(dateString: string, options: Intl.DateTimeFormatOptions = {}): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date);
}

// Format time to display in a readable format
export function formatTime(dateString: string, options: Intl.DateTimeFormatOptions = {}): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    ...options,
  }).format(date);
}

// Get weather icon based on the weather condition
export function getWeatherIconName(condition: WeatherCondition): string {
  const iconId = condition.icon;
  const isDay = iconId.includes('d');
  
  // Map OpenWeatherMap icon codes to Lucide icon names
  switch (condition.main.toLowerCase()) {
    case 'clear':
      return isDay ? 'sun' : 'moon';
    case 'clouds':
      if (condition.description.includes('few')) {
        return isDay ? 'cloud-sun' : 'cloud-moon';
      }
      return 'cloud';
    case 'rain':
    case 'drizzle':
      return 'cloud-rain';
    case 'thunderstorm':
      return 'cloud-lightning';
    case 'snow':
      return 'cloud-snow';
    case 'mist':
    case 'smoke':
    case 'haze':
    case 'dust':
    case 'fog':
      return 'cloud-fog';
    default:
      return isDay ? 'sun' : 'moon';
  }
}

// Get weather background class based on weather condition
export function getWeatherBackgroundClass(condition: WeatherCondition): string {
  const iconId = condition.icon;
  const isDay = iconId.includes('d');
  
  const main = condition.main.toLowerCase();
  
  if (!isDay) {
    return 'night-bg-gradient';
  }
  
  switch (main) {
    case 'clear':
      return 'bg-gradient-to-br from-blue-400 to-blue-600';
    case 'clouds':
      return 'bg-gradient-to-br from-gray-300 to-blue-500';
    case 'rain':
    case 'drizzle':
      return 'bg-gradient-to-br from-gray-400 to-gray-700';
    case 'thunderstorm':
      return 'bg-gradient-to-br from-gray-600 to-gray-900';
    case 'snow':
      return 'bg-gradient-to-br from-gray-100 to-blue-300';
    case 'mist':
    case 'smoke':
    case 'haze':
    case 'dust':
    case 'fog':
      return 'bg-gradient-to-br from-gray-300 to-gray-500';
    default:
      return 'bg-gradient-to-br from-blue-400 to-blue-600';
  }
}

// Get wind direction as a compass point
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// Format location name
export function formatLocationName(name: string, state?: string, country?: string): string {
  let formattedName = name;
  
  if (state) {
    formattedName += `, ${state}`;
  }
  
  if (country) {
    formattedName += `, ${country}`;
  }
  
  return formattedName;
}

// Get current user's location using browser geolocation API
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function isValidPassword(password: string): boolean {
  // At least 8 characters, containing at least one number and one letter
  return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
}