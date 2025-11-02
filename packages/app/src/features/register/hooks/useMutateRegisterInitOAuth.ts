import { REG_INIT_COOKIE_KEYS } from '../../../utils/document/oauthCookies';
import { registerInitGithub } from '../api/registerApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useMutateRegisterInitOAuth = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerInitGithub,
    onSuccess: () => {
      const sessionId = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${REG_INIT_COOKIE_KEYS.registration_id}=`))
        ?.split('=')[1];

      if (sessionId) {
        const targetUrl = `/register/onboarding?flow=oauth&session=${sessionId}`;
        console.log('Navigating to:', targetUrl);
        navigate(targetUrl);
      } else {
        console.error('Session ID cookie not found');
      }
    },
    onError: error => {
      console.error('OAuth init failed:', error);
    },
  });
};
