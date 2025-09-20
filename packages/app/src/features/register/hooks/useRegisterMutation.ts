import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/registerApi';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import { AUTH_REDUCER_ACTION_TYPE } from '../../../context/AuthContext';
import type { AuthenticationRegisterRequestPublicSchema } from '@dev-dashboard/shared';

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  return useMutation({
    mutationFn: (data: AuthenticationRegisterRequestPublicSchema) =>
      registerApi(data),
    onSuccess: data => {
      dispatch({
        type: AUTH_REDUCER_ACTION_TYPE.SET_AUTH,
        payload: data.user,
      });
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/todos');
    },
    onError: error => {
      console.error('Register failed:', error);
      // TODO: Show error message to user
    },
  });
};
