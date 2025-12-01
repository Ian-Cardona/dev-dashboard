import AppLayout from '../../components/layout/AppLayout';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
