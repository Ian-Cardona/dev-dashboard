import { getUserProfile } from '../auth/getUserProfile';
import { refreshUserToken } from '../auth/refreshUserToken';
import type { AuthorizationJwt } from '@dev-dashboard/shared';
import type { QueryObserverOptions } from '@tanstack/react-query';

export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
};

export type AuthQueryKey = ReturnType<typeof authQueryKeys.user>;

export const fetchAuth = async () => {
  try {
    const refreshResponse: AuthorizationJwt = await refreshUserToken();

    if (!refreshResponse || !refreshResponse.accessToken) {
      console.error('Invalid refresh response:', refreshResponse);
      throw new Error('Invalid token refresh response');
    }

    localStorage.setItem('accessToken', refreshResponse.accessToken);
    const userResponse = await getUserProfile();
    if (!userResponse) {
      throw new Error('Failed to fetch user profile after token refresh');
    }

    return userResponse;
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
