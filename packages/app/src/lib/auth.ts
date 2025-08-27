import type { AuthenticationResponsePublicSchema } from '../../../shared/src/types/auth.type';
import { publicClient } from './api';

export const authApi = {
  refresh: async (): Promise<AuthenticationResponsePublicSchema> => {
    const res = await publicClient.post('/auth/refresh');
    return res.data;
  },
};
