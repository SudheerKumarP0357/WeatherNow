// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultLocation?: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  theme: 'light' | 'dark' | 'system';
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';
export type LocationErrorType = 'DENIED' | 'TIMEOUT' | 'UNAVAILABLE' | 'UNKNOWN' | null;
// Weather related types
export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  alerts?: WeatherAlert[];
  location: Location;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  pressure: number;
  uv_index: number;
  visibility: number;
  weather_condition: WeatherCondition;
  datetime: string;
  sunrise: string;
  sunset: string;
}

export interface DailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  weather_condition: WeatherCondition;
  sunrise: string;
  sunset: string;
  precipitation_probability: number;
  summary: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherAlert {
  sender: string;
  event: string;
  start: number;
  end: number;
  description: string;
}

export interface Location {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface LocationSuggestion {
  id: string;
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export interface RecentLocation {
  id: string;
  name: string;
  state?: string;
  country: string;
  lastViewed: string;
}

export interface FavoriteLocation {
  id: string;
  name: string;
  state?: string;
  country: string;
  addedAt: string;
}

// API related types
export interface ApiError {
  code: string;
  message: string;
}