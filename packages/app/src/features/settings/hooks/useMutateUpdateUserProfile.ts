import { updateUserProfile } from '../api/userProfileApi';
import type { UserUpdate } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';

export const useMutateUpdateUserProfile = () => {
  return useMutation({
    mutationKey: ['user', 'profile', 'update'],
    mutationFn: (data: UserUpdate) => updateUserProfile(data),
  });
};
