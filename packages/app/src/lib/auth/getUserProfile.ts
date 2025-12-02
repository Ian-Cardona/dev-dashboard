import { protectedClient } from '../api/protectedClient';
import type { UserPublic } from '@dev-dashboard/shared';

export const getUserProfile = async (): Promise<UserPublic> => {
  const { data } = await protectedClient.get<UserPublic>('/user/profile');
  return data;
};
