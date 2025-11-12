import { updateUserProfile } from '../api/userProfileApi';
import type { UserPasswordUpdate } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';

export const useMutateUpdateUserProfile = () => {
  return useMutation({
    mutationKey: ['user', 'profile', 'update'],
    mutationFn: (data: UserPasswordUpdate) => updateUserProfile(data),
  });
};
