import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { state } = useAuth();

  if (!state.authenticatedUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { state } = useAuth();

  if (state.authenticatedUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
