import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WeatherDetailsPage from './pages/WeatherDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { isDarkMode } = useTheme();
  const { isInitialized } = useAuth();

  // Update document class for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-slow">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/weather/:cityId" element={<WeatherDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

export default App;