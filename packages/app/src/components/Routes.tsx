import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export const ProtectedRoute = () => {
  const { state } = useAuth();

  if (state.isLoading) {
    return <LoadingSpinner />;
  }

  if (!state.authUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { state } = useAuth();

  if (state.isLoading) {
    return <LoadingSpinner />;
  }

  if (state.authUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
