import { AUTH_REDUCER_ACTION_TYPE } from '../../../context/AuthContext';
import { useAuth } from '../../../hooks/useAuth';
import { completeRegistrationOAuth } from '../api/registerApi';
import type { RegistrationInfoRequest } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useMutateRegisterOauth = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  return useMutation({
    mutationFn: (data: RegistrationInfoRequest) =>
      completeRegistrationOAuth(data),
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
