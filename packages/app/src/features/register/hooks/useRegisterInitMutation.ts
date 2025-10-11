import { registerInitEmail } from '../api/registerApi';
import type { RegisterInitEmailRegisterRequest } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useRegisterInitMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterInitEmailRegisterRequest) =>
      registerInitEmail(data),
    onSuccess: () => {
      navigate('/register/onboarding');
    },
    onError: error => {
      console.error('Register failed:', error);
      // TODO: Show error message to user
    },
  });
};
