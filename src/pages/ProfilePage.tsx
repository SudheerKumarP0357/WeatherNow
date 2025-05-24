import { useState } from 'react';
import { User, Mail, Moon, Sun, ThermometerSun, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserPreferences } from '../types';
import { getFavoriteLocations, getRecentLocations, clearRecentLocations, removeFavoriteLocation } from '../utils/storage';

export default function ProfilePage() {
  const { user, updateUser, updatePreferences, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [name, setName] = useState(user?.name || '');
  const [favoriteLocations, setFavoriteLocations] = useState(getFavoriteLocations());
  const [recentLocations, setRecentLocations] = useState(getRecentLocations());
  const [isEditing, setIsEditing] = useState(false);
  
  if (!user) {
    return null; // This should be handled by the ProtectedRoute component
  }
  
  const handleSaveProfile = () => {
    updateUser({ name });
    setIsEditing(false);
  };
  
  const handleThemeChange = (newTheme: UserPreferences['theme']) => {
    setTheme(newTheme);
    updatePreferences({ theme: newTheme });
  };
  
  const handleTemperatureUnitChange = (unit: 'celsius' | 'fahrenheit') => {
    updatePreferences({ temperatureUnit: unit });
  };
  
  const handleRemoveFavorite = (locationId: string) => {
    removeFavoriteLocation(locationId);
    setFavoriteLocations(getFavoriteLocations());
  };
  
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your location history?')) {
      clearRecentLocations();
      setRecentLocations([]);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Profile</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Account Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input pl-10"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    onClick={handleSaveProfile}
                    className="w-full btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name || 'Not set'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`flex-1 flex flex-col items-center py-3 px-4 rounded-lg border ${
                      theme === 'light'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Sun className={`h-6 w-6 mb-2 ${
                      theme === 'light'
                        ? 'text-primary-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      theme === 'light'
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Light
                    </span>
                  </button>
                  
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`flex-1 flex flex-col items-center py-3 px-4 rounded-lg border ${
                      theme === 'dark'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Moon className={`h-6 w-6 mb-2 ${
                      theme === 'dark'
                        ? 'text-primary-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      theme === 'dark'
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Dark
                    </span>
                  </button>
                  
                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`flex-1 flex flex-col items-center py-3 px-4 rounded-lg border ${
                      theme === 'system'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className={`h-6 w-6 mb-2 flex items-center justify-center ${
                      theme === 'system'
                        ? 'text-primary-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      <Sun className="h-4 w-4" style={{ marginRight: '-4px' }} />
                      <Moon className="h-4 w-4" style={{ marginLeft: '-4px' }} />
                    </div>
                    <span className={`text-sm font-medium ${
                      theme === 'system'
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      System
                    </span>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Temperature Unit</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleTemperatureUnitChange('celsius')}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg border ${
                      user.preferences.temperatureUnit === 'celsius'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <ThermometerSun className={`h-5 w-5 mr-2 ${
                      user.preferences.temperatureUnit === 'celsius'
                        ? 'text-primary-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      user.preferences.temperatureUnit === 'celsius'
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Celsius (°C)
                    </span>
                  </button>
                  
                  <button
                    onClick={() => handleTemperatureUnitChange('fahrenheit')}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg border ${
                      user.preferences.temperatureUnit === 'fahrenheit'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <ThermometerSun className={`h-5 w-5 mr-2 ${
                      user.preferences.temperatureUnit === 'fahrenheit'
                        ? 'text-primary-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      user.preferences.temperatureUnit === 'fahrenheit'
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      Fahrenheit (°F)
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Favorite Locations</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {favoriteLocations.length} saved
              </span>
            </div>
            
            {favoriteLocations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                You haven't saved any favorite locations yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {favoriteLocations.map((location) => (
                  <li key={location.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {location.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {location.state ? `${location.state}, ` : ''}{location.country}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(location.id)}
                        className="text-gray-400 hover:text-error-500 p-1"
                        aria-label="Remove from favorites"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Searches</h2>
              <button
                onClick={handleClearHistory}
                className="text-sm text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400 flex items-center"
                disabled={recentLocations.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </button>
            </div>
            
            {recentLocations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Your search history is empty.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentLocations.slice(0, 5).map((location) => (
                  <li key={location.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {location.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {location.state ? `${location.state}, ` : ''}{location.country}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(location.lastViewed).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={logout}
            className="btn btn-outline flex items-center text-gray-700 dark:text-gray-300 hover:text-error-600 dark:hover:text-error-400"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}