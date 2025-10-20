import { publicClient } from './api';
import type { LoginPublic } from '@dev-dashboard/shared';

export const authApi = {
  refresh: async (): Promise<LoginPublic> => {
    const res = await publicClient.post('/auth/refresh');
    return res.data;
  },
};
