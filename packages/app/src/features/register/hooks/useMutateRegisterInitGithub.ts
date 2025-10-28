import { registerInitGithub } from '../api/registerApi';
import type { OAuthRequest } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useMutateRegisterInitGithub = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: OAuthRequest) => registerInitGithub(data),
    onSuccess: () => {
      navigate('/register/onboarding?flow=oauth');
    },
  });
};
