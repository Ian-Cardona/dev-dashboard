import AppLayout from '../../components/layout/AppLayout';
import { fetchAuth, authQueryKeys } from '../../lib/tanstack/auth';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const cachedUser = context.queryClient.getQueryData(authQueryKeys.user());
    if (cachedUser) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }

    try {
      const user = await fetchAuth();
      context.queryClient.setQueryData(authQueryKeys.user(), user);
    } catch (error) {
      localStorage.removeItem('accessToken');
      context.queryClient.setQueryData(authQueryKeys.user(), null);
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
  notFoundComponent: () => {
    throw new Error('Route not found');
  },
});
