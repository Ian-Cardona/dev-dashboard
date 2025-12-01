import CustomToast from '../components/ui/toasts/CustomToast';
import type { AuthState } from '../lib/states/AuthState';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

type RouterContext = {
  queryClient: QueryClient;
  auth: AuthState;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <CustomToast />
      <TanStackRouterDevtools />
    </>
  ),
});
