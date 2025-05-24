import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPreferences, AuthStatus } from '../types';
import { getUser, saveUser, removeUser, getAuthToken, saveAuthToken, removeAuthToken } from '../utils/storage';

// Mock data for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'Password123',
    name: 'Demo User',
    preferences: {
      defaultLocation: undefined,
      temperatureUnit: 'celsius',
      theme: 'system',
    } as UserPreferences,
  },
];

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from local storage
  useEffect(() => {
    const storedUser = getUser();
    const token = getAuthToken();
    
    if (storedUser && token) {
      setUser(storedUser);
      setStatus('authenticated');
    } else {
      setStatus('unauthenticated');
    }
    
    setIsInitialized(true);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call to authenticate
    const mockUser = MOCK_USERS.find(user => user.email === email && user.password === password);
    
    if (!mockUser) {
      throw new Error('Invalid email or password');
    }
    
    // Create user object without password
    const { password: _, ...userWithoutPassword } = mockUser;
    const authenticatedUser = userWithoutPassword as User;
    
    // Save to local storage
    saveUser(authenticatedUser);
    saveAuthToken('mock-auth-token');
    
    // Update state
    setUser(authenticatedUser);
    setStatus('authenticated');
  };

  // Register function
  const register = async (email: string, password: string, name?: string) => {
    // In a real app, this would be an API call to register
    const existingUser = MOCK_USERS.find(user => user.email === email);
    
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      preferences: {
        temperatureUnit: 'celsius',
        theme: 'system',
      },
    };
    
    // In a real app, this would be saved to a database
    MOCK_USERS.push({ ...newUser, password });
    
    // Save to local storage
    saveUser(newUser);
    saveAuthToken('mock-auth-token');
    
    // Update state
    setUser(newUser);
    setStatus('authenticated');
  };

  // Logout function
  const logout = () => {
    // Remove from local storage
    removeUser();
    removeAuthToken();
    
    // Update state
    setUser(null);
    setStatus('unauthenticated');
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    
    // Save to local storage
    saveUser(updatedUser);
    
    // Update state
    setUser(updatedUser);
  };

  // Update preferences function
  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    const updatedPreferences = { ...user.preferences, ...preferences };
    const updatedUser = { ...user, preferences: updatedPreferences };
    
    // Save to local storage
    saveUser(updatedUser);
    
    // Update state
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      status,
      isInitialized,
      login,
      register,
      logout,
      updateUser,
      updatePreferences,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}