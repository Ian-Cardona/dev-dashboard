import { publicClient } from '../api/publicClient';
import { getConfig } from '../configs/getConfig';
import type { AuthorizationJwt } from '@dev-dashboard/shared';

const getAuthenticationEndpoints = () => getConfig().AUTHENTICATION_ENDPOINTS;

let refreshPromise: Promise<AuthorizationJwt> | null = null;

export const refreshUserToken = async (): Promise<AuthorizationJwt> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = publicClient
    .post(getAuthenticationEndpoints().refresh)
    .then(res => {
      console.log('Refresh successful');
      return res.data;
    })
    .catch(error => {
      console.error('Refresh failed:', error);
      refreshPromise = null;
      throw error;
    })
    .finally(() => {
      setTimeout(() => {
        refreshPromise = null;
      }, 1000);
    });

  return refreshPromise;
};
