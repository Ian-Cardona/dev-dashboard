import { registerInitEmail } from '../api/registerApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useMutateRegisterInitEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerInitEmail,
    onSuccess: () => {
      const sessionId = document.cookie
        .split('; ')
        .find(row => row.startsWith('esi1='))
        ?.split('=')[1];

      if (sessionId) {
        navigate(`/register/onboarding?flow=email&session=${sessionId}`);
      }
    },
  });
};
