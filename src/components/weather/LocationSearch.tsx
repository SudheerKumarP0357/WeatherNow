import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, X, Clock, Heart, LayoutList } from 'lucide-react';
import useLocationSearch from '../../hooks/useLocationSearch';
import { formatLocationName } from '../../utils/helpers';
import { getCurrentPosition } from '../../utils/helpers';
import { getLocationByCoordinates } from '../../utils/api';
import { LocationSuggestion, RecentLocation, FavoriteLocation } from '../../types';
import { getRecentLocations, getFavoriteLocations, addRecentLocation } from '../../utils/storage';

export default function LocationSearch() {
  const { query, setQuery, suggestions, loading, clearSuggestions } = useLocationSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentLocations, setRecentLocations] = useState<RecentLocation[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'recent' | 'favorites'>('suggestions');
  const [geoLocationLoading, setGeoLocationLoading] = useState(false);
  const [geoLocationError, setGeoLocationError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Load recent and favorite locations
  useEffect(() => {
    setRecentLocations(getRecentLocations());
    setFavoriteLocations(getFavoriteLocations());
  }, []);
  
  // Handle clicks outside the search component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Set active tab based on input and suggestions
  useEffect(() => {
    if (query && suggestions.length > 0) {
      setActiveTab('suggestions');
    } else if (query && suggestions.length === 0) {
      // Show recent if no suggestions found
      setActiveTab('recent');
    }
  }, [query, suggestions]);
  
  // Handle focus on search input
  const handleFocus = () => {
    setShowDropdown(true);
    if (!query) {
      setActiveTab('recent');
    }
  };
  
  // Handle selection of a location suggestion
  const handleSelectLocation = (location: LocationSuggestion | RecentLocation | FavoriteLocation) => {
    // Create a recent location object
    const recentLocation: RecentLocation = {
      id: location.id,
      name: location.name,
      state: 'state' in location ? location.state : undefined,
      country: location.country,
      lastViewed: new Date().toISOString(),
    };
    
    // Add to recent locations
    addRecentLocation(recentLocation);
    
    // Update local state
    setRecentLocations(getRecentLocations());
    
    // Navigate to the weather details page
    navigate(`/weather/${location.id}`);
    
    // Clear the search
    setQuery('');
    clearSuggestions();
    setShowDropdown(false);
  };
  
  // Handle geolocation request
  const handleUseMyLocation = async () => {
    setGeoLocationLoading(true);
    setGeoLocationError(null);
    
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Get location details from coordinates
      const location = await getLocationByCoordinates(latitude, longitude);
      
      // Create a recent location and navigate
      const recentLocation: RecentLocation = {
        id: location.id,
        name: location.name,
        state: location.state,
        country: location.country,
        lastViewed: new Date().toISOString(),
      };
      
      addRecentLocation(recentLocation);
      setRecentLocations(getRecentLocations());
      
      navigate(`/weather/${location.id}`);
    } catch (error) {
      console.error('Geolocation error:', error);
      setGeoLocationError(
        error instanceof Error
          ? error.message
          : 'Failed to get your location. Please check your browser permissions.'
      );
    } finally {
      setGeoLocationLoading(false);
    }
  };
  
  return (
    <div ref={searchRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        
        <input
          type="text"
          className="input pl-10 pr-10 py-3"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          aria-label="Search for a city"
        />
        
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => {
              setQuery('');
              clearSuggestions();
            }}
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
          </button>
        )}
      </div>
      
      <button
        onClick={handleUseMyLocation}
        disabled={geoLocationLoading}
        className="mt-2 w-full btn btn-outline flex items-center justify-center"
        aria-label="Use my location"
      >
        <MapPin className="h-4 w-4 mr-2" />
        {geoLocationLoading ? 'Getting location...' : 'Use my location'}
      </button>
      
      {geoLocationError && (
        <p className="mt-2 text-sm text-error-600 dark:text-error-400">{geoLocationError}</p>
      )}
      
      {showDropdown && (
        <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700 animate-slide-down">
          <div className="p-2 flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
                activeTab === 'suggestions'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('suggestions')}
            >
              <div className="flex items-center justify-center">
                <Search className="h-4 w-4 mr-1" />
                Search
              </div>
            </button>
            
            <button
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
                activeTab === 'recent'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('recent')}
            >
              <div className="flex items-center justify-center">
                <Clock className="h-4 w-4 mr-1" />
                Recent
              </div>
            </button>
            
            <button
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${
                activeTab === 'favorites'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('favorites')}
            >
              <div className="flex items-center justify-center">
                <Heart className="h-4 w-4 mr-1" />
                Favorites
              </div>
            </button>
          </div>
          
          <div className="max-h-72 overflow-y-auto p-2">
            {activeTab === 'suggestions' && (
              <>
                {loading && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <div className="inline-block animate-spin h-5 w-5 border-2 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full mr-2"></div>
                    Searching...
                  </div>
                )}
                
                {!loading && suggestions.length === 0 && query && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No locations found
                  </div>
                )}
                
                {!loading && suggestions.length === 0 && !query && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Start typing to search for a location
                  </div>
                )}
                
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={() => handleSelectLocation(suggestion)}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {suggestion.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {suggestion.state ? `${suggestion.state}, ` : ''}{suggestion.country}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
            
            {activeTab === 'recent' && (
              <>
                {recentLocations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <LayoutList className="h-6 w-6 mx-auto mb-2" />
                    No recent locations
                  </div>
                ) : (
                  recentLocations.map((location) => (
                    <button
                      key={location.id}
                      className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => handleSelectLocation(location)}
                    >
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {location.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatLocationName('', location.state, location.country).substring(2)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </>
            )}
            
            {activeTab === 'favorites' && (
              <>
                {favoriteLocations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <Heart className="h-6 w-6 mx-auto mb-2" />
                    No favorite locations
                  </div>
                ) : (
                  favoriteLocations.map((location) => (
                    <button
                      key={location.id}
                      className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => handleSelectLocation(location)}
                    >
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-error-500 mr-2" />
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {location.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatLocationName('', location.state, location.country).substring(2)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}