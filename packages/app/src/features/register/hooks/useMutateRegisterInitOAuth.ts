import { getRegInitCookieKeys } from '../../../utils/configs/getConfig';
import { registerInitGithub } from '../api/registerApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

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
        navigate(`/register/onboarding?flow=oauth&session=${sessionId}`);
      }
    },
  });
};
