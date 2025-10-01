import { protectedClient } from '../../../lib/api';
import type { UserResponsePublic, UserUpdate } from '@dev-dashboard/shared';

const fetchUserProfile = async (): Promise<UserResponsePublic> => {
  const response =
    await protectedClient.get<UserResponsePublic>('/user/profile');
  return response.data;
};

const updateUserProfile = async (
  data: UserUpdate
): Promise<UserResponsePublic> => {
  const response = await protectedClient.put<UserResponsePublic>(
    '/user/profile',
    data
  );
  return response.data;
};

export { fetchUserProfile, updateUserProfile };
