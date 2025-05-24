import { useState, useCallback, useEffect } from 'react';
import { LocationSuggestion } from '../types';
import { searchLocations } from '../utils/api';
import { debounce } from '../utils/debounce';

interface UseLocationSearchResult {
  query: string;
  setQuery: (query: string) => void;
  suggestions: LocationSuggestion[];
  loading: boolean;
  error: string | null;
  clearSuggestions: () => void;
}

export default function useLocationSearch(): UseLocationSearchResult {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const results = await searchLocations(searchQuery);
        setSuggestions(results);
      } catch (err) {
        console.error('Error searching locations:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while searching');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );
  
  // Effect to trigger search when query changes
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  // Function to clear suggestions
  const clearSuggestions = () => {
    setSuggestions([]);
    setQuery('');
  };
  
  return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    clearSuggestions,
  };
}