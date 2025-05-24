import { useState } from 'react';
import { WeatherAlert } from '../../types';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface WeatherAlertsProps {
  alerts?: WeatherAlert[];
}

export default function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  const [expandedAlerts, setExpandedAlerts] = useState<string[]>([]);
  
  if (!alerts || alerts.length === 0) {
    return null;
  }
  
  const toggleAlert = (alertId: string) => {
    setExpandedAlerts(current => 
      current.includes(alertId)
        ? current.filter(id => id !== alertId)
        : [...current, alertId]
    );
  };
  
  return (
    <div className="glass-card p-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 animate-fade-in">
      <h3 className="text-xl font-semibold text-error-800 dark:text-error-300 mb-4 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        Weather Alerts
      </h3>
      
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const alertId = `alert-${index}`;
          const isExpanded = expandedAlerts.includes(alertId);
          
          return (
            <div key={index} className="border-b border-error-200 dark:border-error-800 last:border-0 pb-3">
              <button
                className="w-full text-left flex items-center justify-between text-error-700 dark:text-error-400 font-medium"
                onClick={() => toggleAlert(alertId)}
                aria-expanded={isExpanded}
              >
                <div className="flex-1">
                  <span className="text-sm md:text-base">{alert.event}</span>
                  <p className="text-xs text-error-600 dark:text-error-500">
                    From: {new Date(alert.start * 1000).toLocaleString()}
                    <br />
                    To: {new Date(alert.end * 1000).toLocaleString()}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-shrink-0" />
                )}
              </button>
              
              {isExpanded && (
                <div className="mt-2 text-sm text-error-700 dark:text-error-400 whitespace-pre-line">
                  {alert.description}
                  <p className="mt-1 text-xs text-error-600 dark:text-error-500">
                    Source: {alert.sender}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}