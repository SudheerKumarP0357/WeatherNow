import { Github, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {currentYear} WeatherNow. All rights reserved.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
              Weather data provided by OpenWeatherMap
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            
            <p className="flex items-center text-sm text-gray-500 dark:text-gray-500">
              Made with <Heart className="h-4 w-4 mx-1 text-error-500" /> in 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}