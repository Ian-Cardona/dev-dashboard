import { authQueryKeys } from '../../../lib/tanstack/auth';
import { loginByOAuth } from '../api/loginApi';
import type { LoginPublic, OAuthRequest } from '@dev-dashboard/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export const useMutateLoginOAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OAuthRequest) => loginByOAuth(data),
    retry: false,
    onSuccess: (data: LoginPublic) => {
      localStorage.setItem('accessToken', data.accessToken);
      queryClient.setQueryData(authQueryKeys.user(), data.user);

      navigate({ to: '/todos/pending' });
    },
    onError: () => {
      localStorage.removeItem('accessToken');
      queryClient.setQueryData(authQueryKeys.user(), null);
    },
  });
};
