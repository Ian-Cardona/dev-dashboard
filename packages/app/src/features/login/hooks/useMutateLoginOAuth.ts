import { AUTH_REDUCER_ACTION_TYPE } from '../../../context/AuthContext';
import { useAuth } from '../../../hooks/useAuth';
import { loginByOAuth } from '../api/loginApi';
import type { OAuthRequest } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useMutateLoginOAuth = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  return useMutation({
    mutationFn: (data: OAuthRequest) => loginByOAuth(data),
    onSuccess: data => {
      dispatch({
        type: AUTH_REDUCER_ACTION_TYPE.SET_AUTH,
        payload: data.user,
      });
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/todos', { replace: true });
    },
    onError: (error: any) => {
      if (error.code === 'access_denied') {
        return;
      }
      if (error.code === 'invalid_state') {
        navigate('/login?error=invalid_state', { replace: true });
        return;
      }
      if (error.status >= 500) {
        navigate('/error?type=server', { replace: true });
        return;
      }

      if (error.code === 'user_not_found') {
        navigate('/register?error=user_not_found', { replace: true });
        return;
      }
      if (error.code === 'oauth_failed') {
        navigate('/login?error=oauth_failed', { replace: true });
        return;
      }

      // TODO: Add toasts here
    },
  });
};
