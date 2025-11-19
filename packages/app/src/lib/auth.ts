import { getConfig } from '../utils/configs/getConfig';
import { publicClient } from './api';
import type { LoginPublic } from '@dev-dashboard/shared';

const getAuthenticationEndpoints = () => getConfig().AUTHENTICATION_ENDPOINTS;

export const authApi = {
  refresh: async (): Promise<LoginPublic> => {
    const res = await publicClient.post(getAuthenticationEndpoints().refresh);
    return res.data;
  },
};
