import { AUTH_REDUCER_ACTION_TYPE } from '../../../context/AuthContext';
import { useAuth } from '../../../hooks/useAuth';
import { loginByEmail } from '../api/loginApi';
import type { LoginRequestPublic } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useMutateLoginEmail = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  return useMutation({
    mutationFn: (data: LoginRequestPublic) => loginByEmail(data),
    onSuccess: data => {
      dispatch({
        type: AUTH_REDUCER_ACTION_TYPE.SET_AUTH,
        payload: data.user,
      });
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/todos', { replace: true });
    },
  });
};
