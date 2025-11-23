import { registerInitEmail } from '../api/registerApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

// import { getRegInitCookieKeys } from '../../../utils/configs/getConfig';

// const regInitCookieKeys = getRegInitCookieKeys();

export const useMutateRegisterInitEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerInitEmail,
    onSuccess: () => {
      const sessionId = document.cookie
        .split('; ')
        .find(row => row.startsWith('esi1=')) // TODO: use config for the cookies
        ?.split('=')[1];

      if (sessionId) {
        navigate(`/register/onboarding?flow=email&session=${sessionId}`);
      }
    },
  });
};
