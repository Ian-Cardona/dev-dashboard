import { authQueryKeys } from '../../../lib/tanstack/auth';
import { logoutUser } from '../api/accountApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export const useMutateLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutUser(),
    onMutate: () => {
      localStorage.removeItem('accessToken');
      queryClient.setQueryData(authQueryKeys.user(), null);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authQueryKeys.user() });
      queryClient.clear();

      navigate({ to: '/login' });
    },
    onError: error => {
      console.error('Logout error:', error);
      navigate({ to: '/login' });
    },
    retry: false,
  });
};
