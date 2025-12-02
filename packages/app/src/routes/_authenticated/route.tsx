import AppLayout from '../../components/layout/AppLayout';
import { authQueryKeys } from '../../lib/tanstack/auth';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const user = context.queryClient.getQueryData(authQueryKeys.user());
    if (user) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }

    try {
      await context.queryClient.fetchQuery({
        queryKey: authQueryKeys.user(),
      });

      const updatedUser = context.queryClient.getQueryData(
        authQueryKeys.user()
      );
      if (!updatedUser) {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
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
});
