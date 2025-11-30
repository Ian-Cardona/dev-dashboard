import LoadingSpinner from '../components/ui/LoadingSpinner';
import CustomToast from '../components/ui/toasts/CustomToast';
import { AUTH_REDUCER_ACTION_TYPE } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useEffect } from 'react';

interface RouterContext {
  queryClient: QueryClient;
}

const RootComponent = () => {
  const { auth } = Route.useLoaderData();
  const { dispatch } = useAuth();

  useEffect(() => {
    if (auth.status === 'authenticated' && auth.user) {
      dispatch({ type: AUTH_REDUCER_ACTION_TYPE.SET_AUTH, payload: auth.user });
    } else {
      dispatch({ type: AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH });
    }
  }, [auth, dispatch]);

  return (
    <>
      <Outlet />
      <CustomToast />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  loader: async () => {
    const auth = await loadAuth();
    return { auth };
  },
  component: RootComponent,
  pendingComponent: () => <LoadingSpinner />,
});
