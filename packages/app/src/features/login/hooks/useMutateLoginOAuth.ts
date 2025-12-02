import { authQueryKeys } from '../../../lib/tanstack/auth';
import { loginByOAuth } from '../api/loginApi';
import type { OAuthRequest } from '@dev-dashboard/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export const useMutateLoginOAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OAuthRequest) => loginByOAuth(data),
    retry: false,
    onSuccess: async data => {
      localStorage.setItem('accessToken', data.accessToken);

      queryClient.setQueryData(authQueryKeys.user(), data.user);
      queryClient.invalidateQueries({ queryKey: authQueryKeys.user() });

      await queryClient.refetchQueries({
        queryKey: authQueryKeys.user(),
        type: 'active',
      });

      navigate({ to: '/todos/pending' });
    },
    onError: error => {
      console.error('Login error:', error);
      localStorage.removeItem('accessToken');
      queryClient.setQueryData(authQueryKeys.user(), null);
    },
  });
};
