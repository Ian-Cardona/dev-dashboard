import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/registerApi';
import { useNavigate } from 'react-router';
import type { AuthenticationRegisterRequest } from '../../../../../../shared/types/auth.type';

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: AuthenticationRegisterRequest) => registerApi(data),
    onSuccess: data => {
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/dashboard');

      // TODO: Set user data in context
    },
    onError: error => {
      console.error('Register failed:', error);
      // TODO: Show error message to user
    },
  });
};
