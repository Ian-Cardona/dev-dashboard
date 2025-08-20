import { useNavigate } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import type { AuthenticationLoginRequest } from '../../../../../shared/types/auth.type';
import { loginApi } from '../api/loginApi';
import { AUTH_REDUCER_ACTION_TYPE } from '../../../context/AuthContext';

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
    },
    onError: error => {
      console.error('Login failed:', error);
      // TODO: Toast for errors
    },
  });
};
