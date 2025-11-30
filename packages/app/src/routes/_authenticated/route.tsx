import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

const AuthenticatedLayout = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.status === 'unauthenticated') {
      navigate({ to: '/login', replace: true });
    }
  }, [state.status, navigate]);

  if (state.status === 'unauthenticated') {
    return null;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});
