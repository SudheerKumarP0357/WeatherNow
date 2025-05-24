import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuth();
  const location = useLocation();
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-slow">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    // Redirect to login page and remember the page the user tried to access
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return <>{children}</>;
}