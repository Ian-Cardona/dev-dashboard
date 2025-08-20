import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

interface RouteProps {
  children: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

export const ProtectedRoute = ({ children }: RouteProps) => {
  const { state, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <LoadingSpinner />;
  }

  // after init is done, then decide
  if (!state) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!state.accessToken || !state.user.isActive) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: RouteProps) => {
  const { state, initializing } = useAuth();

  if (initializing) {
    return <LoadingSpinner />;
  }

  if (state?.accessToken && state.user.isActive) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default { ProtectedRoute, PublicRoute };
