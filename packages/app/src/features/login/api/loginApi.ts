import { publicClient } from '../../../lib/api';
import { getConfig } from '../../../utils/configs/getConfig';
import type {
  LoginPublic,
  LoginRequestPublic,
  OAuthRequest,
} from '@dev-dashboard/shared';

const getAuthenticationEndpoints = () => getConfig().AUTHENTICATION_ENDPOINTS;

export const loginByEmail = async (
  data: LoginRequestPublic
): Promise<LoginPublic> => {
  const response = await publicClient.post(
    getAuthenticationEndpoints().login_email,
    data
  );
  return response.data;
};

export const loginByOAuth = async (
  data: OAuthRequest
): Promise<LoginPublic> => {
  const response = await publicClient.post(
    getAuthenticationEndpoints().login_oauth,
    data
  );
  return response.data;
};
