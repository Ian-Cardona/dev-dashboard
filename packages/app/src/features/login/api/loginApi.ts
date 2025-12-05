import { publicClient } from '../../../lib/api/publicClient';
import { getConfig } from '../../../lib/configs/getConfig';
import type {
  LoginPublic,
  LoginRequestPublic,
  OAuthRequest,
} from '@dev-dashboard/shared';

const getAuthenticationEndpoints = () => getConfig().AUTHENTICATION_ENDPOINTS;

export const loginByEmail = async (
  data: LoginRequestPublic
): Promise<LoginPublic> => {
  if (!data.email || !data.password) {
    throw new Error('Email and password are required');
  }

  const response = await publicClient.post(
    getAuthenticationEndpoints().login_email,
    data
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Login failed with status: ${response.status}`);
  }

  return response.data;
};

export const loginByOAuth = async (
  data: OAuthRequest
): Promise<LoginPublic> => {
  if (!data) {
    throw new Error('OAuth data is required');
  }

  const response = await publicClient.post(
    getAuthenticationEndpoints().login_oauth,
    data
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`OAuth login failed with status: ${response.status}`);
  }

  return response.data;
};
