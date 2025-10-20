import { useToast } from '../../../hooks/useToast';
import { registerInitGithub } from '../api/registerApi';
import type { OAuthRequest } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useMutateRegisterInitGithub = () => {
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: OAuthRequest) => registerInitGithub(data),
    onSuccess: () => {
      toast.showSuccess('GitHub account linked successfully!');
      navigate('/register/onboarding?flow=oauth', { replace: true });
    },
    onError: (error: any) => {
      console.error('OAuth register error:', error);
      toast.showError('GitHub OAuth failed. Please try again later.');
    },
  });
};
