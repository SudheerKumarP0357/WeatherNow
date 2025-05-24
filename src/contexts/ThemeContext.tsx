import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserPreferences, saveUserPreferences } from '../utils/storage';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: 'light' | 'dark' | 'system';
  toggleDarkMode: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth() || { user: null };

  // Initialize theme from user preferences or system preference
  useEffect(() => {
    const preferences = getUserPreferences();
    const savedTheme = preferences.theme || 'system';
    setThemeState(savedTheme);
  }, []);

  // Update dark mode based on theme setting and system preference
  useEffect(() => {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setIsDarkMode(theme === 'dark');
    }
  }, [theme]);

  // Update user preferences when theme changes
  useEffect(() => {
    if (user) {
      const preferences = getUserPreferences();
      if (preferences.theme !== theme) {
        saveUserPreferences({ ...preferences, theme });
      }
    }
  }, [theme, user]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setThemeState(prevTheme => {
      if (prevTheme === 'system') {
        return isDarkMode ? 'light' : 'dark';
      } else {
        return prevTheme === 'light' ? 'dark' : 'light';
      }
    });
  };

  // Set theme
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      theme,
      toggleDarkMode,
      setTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}