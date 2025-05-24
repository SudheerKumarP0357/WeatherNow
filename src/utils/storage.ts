import { User, UserPreferences, RecentLocation, FavoriteLocation } from '../types';

// Local storage keys
const STORAGE_KEYS = {
  USER: 'weather_app_user',
  AUTH_TOKEN: 'weather_app_auth_token',
  RECENT_LOCATIONS: 'weather_app_recent_locations',
  FAVORITE_LOCATIONS: 'weather_app_favorite_locations',
};

// User storage functions
export function saveUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getUser(): User | null {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  return userJson ? JSON.parse(userJson) : null;
}

export function removeUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// Auth token storage functions
export function saveAuthToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export function removeAuthToken(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

// User preferences storage functions
export function saveUserPreferences(preferences: UserPreferences): void {
  const user = getUser();
  if (user) {
    user.preferences = preferences;
    saveUser(user);
  }
}

export function getUserPreferences(): UserPreferences {
  const user = getUser();
  if (user && user.preferences) {
    return user.preferences;
  }
  
  // Default preferences
  return {
    temperatureUnit: 'celsius',
    theme: 'system',
  };
}

// Recent locations storage functions
export function getRecentLocations(): RecentLocation[] {
  const locationsJson = localStorage.getItem(STORAGE_KEYS.RECENT_LOCATIONS);
  return locationsJson ? JSON.parse(locationsJson) : [];
}

export function addRecentLocation(location: RecentLocation): void {
  const recentLocations = getRecentLocations();
  
  // Remove if already exists
  const filteredLocations = recentLocations.filter(loc => loc.id !== location.id);
  
  // Add to the beginning of the array
  filteredLocations.unshift(location);
  
  // Keep only the last 10 locations
  const updatedLocations = filteredLocations.slice(0, 10);
  
  localStorage.setItem(STORAGE_KEYS.RECENT_LOCATIONS, JSON.stringify(updatedLocations));
}

export function clearRecentLocations(): void {
  localStorage.removeItem(STORAGE_KEYS.RECENT_LOCATIONS);
}

// Favorite locations storage functions
export function getFavoriteLocations(): FavoriteLocation[] {
  const locationsJson = localStorage.getItem(STORAGE_KEYS.FAVORITE_LOCATIONS);
  return locationsJson ? JSON.parse(locationsJson) : [];
}

export function addFavoriteLocation(location: FavoriteLocation): void {
  const favoriteLocations = getFavoriteLocations();
  
  // Check if already exists
  if (!favoriteLocations.some(loc => loc.id === location.id)) {
    favoriteLocations.push(location);
    localStorage.setItem(STORAGE_KEYS.FAVORITE_LOCATIONS, JSON.stringify(favoriteLocations));
  }
}

export function removeFavoriteLocation(locationId: string): void {
  const favoriteLocations = getFavoriteLocations();
  const updatedLocations = favoriteLocations.filter(loc => loc.id !== locationId);
  localStorage.setItem(STORAGE_KEYS.FAVORITE_LOCATIONS, JSON.stringify(updatedLocations));
}

// Clear all app data from local storage
export function clearAllStorageData(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.RECENT_LOCATIONS);
  localStorage.removeItem(STORAGE_KEYS.FAVORITE_LOCATIONS);
}