import { protectedClient } from '../../../lib/api';
import type { UserPasswordUpdate, UserPublic } from '@dev-dashboard/shared';

const fetchUserProfile = async (): Promise<UserPublic> => {
  const response = await protectedClient.get<UserPublic>('/user/profile');
  return response.data;
};

const updateUserProfile = async (
  data: UserPasswordUpdate
): Promise<UserPublic> => {
  const response = await protectedClient.put<UserPublic>('/user/profile', data);
  return response.data;
};

export { fetchUserProfile, updateUserProfile };
