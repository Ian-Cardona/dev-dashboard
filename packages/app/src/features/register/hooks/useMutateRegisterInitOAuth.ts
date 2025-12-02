import { getRegInitCookieKeys } from '../../../lib/configs/getConfig';
import { registerInitGithub } from '../api/registerApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

const regInitCookieKeys = getRegInitCookieKeys();

export const useMutateRegisterInitOAuth = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerInitGithub,
    onSuccess: () => {
      const sessionId = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${regInitCookieKeys.registration_id}=`))
        ?.split('=')[1];

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
