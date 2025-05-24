import { Link } from 'react-router-dom';
import { CloudOff, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <CloudOff className="h-20 w-20 text-gray-400 dark:text-gray-600 mb-6" />
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
        404 - Page Not Found
      </h1>
      
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link
        to="/"
        className="btn btn-primary flex items-center"
      >
        <Home className="h-5 w-5 mr-2" />
        Go to Homepage
      </Link>
    </div>
  );
}