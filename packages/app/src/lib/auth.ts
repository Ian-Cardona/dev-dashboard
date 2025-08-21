import type { AuthenticationSuccessResponse } from '../../../shared/types/auth.type';
import { client } from './api';

export const auth = {
  refresh: async ({
    userId,
  }: {
    userId: string;
  }): Promise<AuthenticationSuccessResponse> => {
    const res = await client.post('/auth/refresh', { userId });
    return res.data;
  },
};
