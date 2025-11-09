import { logoutUser } from '../api/userProfileApi';
import { useMutation } from '@tanstack/react-query';

export const useMutateLogout = () => {
  return useMutation({
    mutationKey: ['user', 'logout'],
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      window.location.href = '/login';
    },
  });
};
