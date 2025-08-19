import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/loginApi';
import { useNavigate } from 'react-router';
import type { AuthenticationLoginRequest } from '../../../../../../shared/types/auth.type';
import { useAuth } from '../../../../hooks/useAuth';
import { AUTH_REDUCER_ACTION_TYPE } from '../../../../context/AuthContext';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  return useMutation({
    mutationFn: (data: AuthenticationLoginRequest) => loginApi(data),
    onSuccess: data => {
      dispatch({
        type: AUTH_REDUCER_ACTION_TYPE.SET_AUTH,
        payload: data,
      });

      navigate('/dashboard');
      // TODO: Set user data in context
    },
    onError: error => {
      console.error('Login failed:', error);
      // TODO: Show error message to user
    },
  });
};
