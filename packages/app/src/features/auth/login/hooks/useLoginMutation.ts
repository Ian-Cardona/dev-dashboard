import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/loginApi';
import { useNavigate } from 'react-router';
import type { AuthenticationLoginRequest } from '../../../../../../shared/types/auth.type';

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: AuthenticationLoginRequest) =>
      loginApi(data.email, data.password),
    onSuccess: data => {
      // TODO: Remove this once HTTPONLY is applied
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/dashboard');

      // TODO: Set user data in context
    },
    onError: error => {
      console.error('Login failed:', error);
      // TODO: Show error message to user
    },
  });
};
