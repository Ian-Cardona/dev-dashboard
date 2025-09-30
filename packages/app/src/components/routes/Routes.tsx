import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute = () => {
  const { state } = useAuth();

  if (state.status === 'loading') return <LoadingSpinner />;
  if (state.status === 'unauthenticated')
    return <Navigate to="/login" replace />;
  if (state.status === 'authenticated') return <Outlet />;
  return null;
};

export const PublicRoute = () => {
  const { state } = useAuth();

  if (state.status === 'loading') return <LoadingSpinner />;
  if (state.status === 'authenticated') {
    return <Navigate to="/todos" replace />;
  }
  return <Outlet />;
};
