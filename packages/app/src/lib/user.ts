import type { UserResponsePublic } from '../../../shared/types/user.type';
import { protectedClient } from './api';

export const userApi = {
  getProfile: async (): Promise<UserResponsePublic> => {
    const res = await protectedClient.get('/user/profile');
    return res.data;
  },
};
