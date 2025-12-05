import { protectedClient } from '../../../lib/api/protectedClient';
import type { UserPasswordUpdate, UserPublic } from '@dev-dashboard/shared';

export const fetchUserProfile = async (): Promise<UserPublic> => {
  const response = await protectedClient.get<UserPublic>('/user/profile');
  return response.data;
};

export const updateUserProfile = async (
  data: UserPasswordUpdate
): Promise<UserPublic> => {
  const response = await protectedClient.put<UserPublic>('/user/profile', data);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await protectedClient.post('/auth/logout');
};
