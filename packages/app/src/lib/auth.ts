import { publicClient } from './api';
import type { AuthenticationResponsePublicSchema } from '@dev-dashboard/shared';

export const authApi = {
  refresh: async (): Promise<AuthenticationResponsePublicSchema> => {
    const res = await publicClient.post('/auth/refresh');
    return res.data;
  },
};
