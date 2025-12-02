import { getUserProfile } from '../auth/getUserProfile';
import { refreshUserToken } from '../auth/refreshUserToken';
import type { QueryObserverOptions } from '@tanstack/react-query';

export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
};

export type AuthQueryKey = ReturnType<typeof authQueryKeys.user>;

export const fetchAuth = async () => {
  try {
    const response = await refreshUserToken();

    localStorage.setItem('accessToken', response.accessToken);

    return response.user || (await getUserProfile());
  } catch (error) {
    localStorage.removeItem('accessToken');
    throw error;
  }
};

export const authQueryOptions: QueryObserverOptions = {
  queryKey: authQueryKeys.user(),
  queryFn: fetchAuth,
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 30,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  refetchOnReconnect: false,
};
