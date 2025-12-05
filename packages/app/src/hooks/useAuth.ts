import { authQueryOptions } from '../lib/tanstack/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { data: user, ...queryInfo } = useQuery(authQueryOptions);

  return {
    user,
    isAuthenticated: !!user,
    ...queryInfo,
    refresh: () =>
      queryClient.invalidateQueries({
        queryKey: authQueryOptions.queryKey,
      }),
  };
};
