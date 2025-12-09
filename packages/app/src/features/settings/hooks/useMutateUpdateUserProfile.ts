import { updateUserProfile } from '../api/accountApi';
import type { UpdateUser } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';

export const useMutateUpdateUserProfile = () => {
  return useMutation({
    mutationKey: ['user', 'profile', 'update'],
    mutationFn: (data: Partial<UpdateUser>) => updateUserProfile(data),
  });
};
