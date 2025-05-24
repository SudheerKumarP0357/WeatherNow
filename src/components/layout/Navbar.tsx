import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LogIn, Sun, Moon, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary-600 dark:text-primary-400 font-semibold text-xl">
                WeatherNow
              </span>
            </Link>
            
            {/* Desktop navigation links */}
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              <Link 
                to="/" 
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-500"
              >
                <Home className="mr-1 h-4 w-4" />
                Home
              </Link>
              {user && (
                <Link 
                  to="/profile" 
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-500"
                >
                  <User className="mr-1 h-4 w-4" />
                  Profile
                </Link>
              )}
            </div>
          </div>
          
          {/* Secondary navigation */}
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {user ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-4 py-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
                >
                  <LogIn className="mr-1 h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              onClick={toggleMenu}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home className="mr-2 h-5 w-5" />
                Home
              </div>
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Profile
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <LogIn className="mr-2 h-5 w-5" />
                    Login
                  </div>
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary-500 text-white hover:bg-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}