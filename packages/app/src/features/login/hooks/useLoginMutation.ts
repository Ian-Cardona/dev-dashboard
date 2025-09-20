import { useNavigate } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/loginApi';
import { AUTH_REDUCER_ACTION_TYPE } from '../../../context/AuthContext';
import type { AuthenticationLoginRequestPublicSchema } from '@dev-dashboard/shared';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  return useMutation({
    mutationFn: (data: AuthenticationLoginRequestPublicSchema) =>
      loginApi(data),
    onSuccess: data => {
      dispatch({
        type: AUTH_REDUCER_ACTION_TYPE.SET_AUTH,
        payload: data.user,
      });
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/todos');
    },
    onError: error => {
      console.error('Login failed:', error);
      // TODO: Toast for errors
    },
  });
};
