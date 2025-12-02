import { getUserProfile } from '../lib/auth/getUserProfile';
import { refreshUserToken } from '../lib/auth/refreshUserToken';
import { useQuery } from '@tanstack/react-query';

export const useAuthQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const response = await refreshUserToken();
        localStorage.setItem('accessToken', response.accessToken);
        return await getUserProfile();
      } catch (error) {
        localStorage.removeItem('accessToken');
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    retryDelay: 1000,
    enabled,
    refetchOnWindowFocus: 'always',
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
