import { registerInitGithub } from '../api/registerApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export const useMutateRegisterInitOAuth = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerInitGithub,
    onSuccess: data => {
      const sessionId = data.registrationId;

      if (sessionId) {
        navigate({
          to: '/register/onboarding',
          search: {
            flow: 'oauth',
            session: sessionId,
          },
        });
      }
    },
  });
};
