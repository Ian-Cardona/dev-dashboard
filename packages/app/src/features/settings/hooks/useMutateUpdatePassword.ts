import { updateUserPassword } from '../api/accountApi';
import type { UserPasswordUpdate } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';

export const useMutateUpdateUserPassword = () => {
  return useMutation({
    mutationKey: ['user', 'password', 'update'],
    mutationFn: (data: UserPasswordUpdate) => updateUserPassword(data),
  });
};
