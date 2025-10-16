import { registerInitOAuth } from '../api/registerApi';
import type { RegisterInitOAuthRegisterRequest } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useRegisterInitGithubMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (body: RegisterInitOAuthRegisterRequest) =>
      registerInitOAuth(body),
    onSuccess: () => {
      navigate('/register/onboarding', { replace: true });
    },
    onError: () => {
      navigate('/register?error=oauth_failed', { replace: true });
    },
  });
};
