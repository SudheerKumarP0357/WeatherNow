import { Thermometer } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface TemperatureUnitToggleProps {
  unit: 'celsius' | 'fahrenheit';
  onChange: (unit: 'celsius' | 'fahrenheit') => void;
}

export default function TemperatureUnitToggle({ unit, onChange }: TemperatureUnitToggleProps) {
  const { user, updatePreferences } = useAuth();
  
  const handleChange = (newUnit: 'celsius' | 'fahrenheit') => {
    onChange(newUnit);
    
    // Update user preferences if logged in
    if (user) {
      updatePreferences({ temperatureUnit: newUnit });
    }
  };
  
  return (
    <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
      <div className="flex items-center">
        <Thermometer className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2 mr-1" />
        
        <button
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            unit === 'celsius'
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => handleChange('celsius')}
          aria-pressed={unit === 'celsius'}
        >
          °C
        </button>
        
        <button
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            unit === 'fahrenheit'
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => handleChange('fahrenheit')}
          aria-pressed={unit === 'fahrenheit'}
        >
          °F
        </button>
      </div>
    </div>
  );
}