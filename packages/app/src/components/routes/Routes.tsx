import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../shared/LoadingSpinner';

export const ProtectedRoute = () => {
  const { state } = useAuth();

  if (state.status === 'loading') return <LoadingSpinner />;
  if (state.status === 'unauthenticated') return <Navigate to="/" replace />;
  if (state.status === 'authenticated') return <Outlet />;
};

export const PublicRoute = () => {
  const { state } = useAuth();

  if (state.status === 'loading') return <LoadingSpinner />;
  if (state.status === 'authenticated') {
    return <Navigate to="/todos" replace />;
  }
  return <Outlet />;
};
