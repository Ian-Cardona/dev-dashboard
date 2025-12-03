import { authQueryKeys } from '../../../lib/tanstack/auth';
import { completeRegistrationOAuth } from '../api/registerApi';
import type { RegistrationInfoRequest } from '@dev-dashboard/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';

export const useMutateRegisterOauth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegistrationInfoRequest) =>
      completeRegistrationOAuth(data),
    onSuccess: data => {
      localStorage.setItem('accessToken', data.accessToken);
      queryClient.setQueryData(authQueryKeys.user(), data.user);
      navigate({ to: '/todos/pending' });
    },
    onError: (error: Error | AxiosError) => {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 401) {
          console.error('Registration error:', error);
          localStorage.removeItem('accessToken');
          queryClient.setQueryData(authQueryKeys.user(), null);
          navigate({
            to: '/register',
            search: {
              error: 'Invalid session. Please start registration again.',
            },
          });
        }
      }
    },
  });
};
