import { registerInitEmail } from '../api/registerApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export const useMutateRegisterInitEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerInitEmail,
    onSuccess: data => {
      const sessionId = data.registrationId;

      if (sessionId) {
        navigate({
          to: '/register/onboarding',
          search: {
            flow: 'email',
            session: sessionId,
          },
        });
      }
    },
  });
};
