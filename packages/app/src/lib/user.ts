import { protectedClient } from './api';
import type { UserPublic } from '@dev-dashboard/shared';

export const userApi = {
  getProfile: async (): Promise<UserPublic> => {
    const res = await protectedClient.get('/user/profile');
    return res.data;
  },
};
