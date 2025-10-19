import { publicClient } from '../../../lib/api';
import type {
  LoginPublic,
  LoginRequestPublic,
  OAuthRequest,
} from '@dev-dashboard/shared';

export const loginByEmail = async (
  data: LoginRequestPublic
): Promise<LoginPublic> => {
  const response = await publicClient.post('/auth/login/email', data);
  return response.data;
};

export const loginByOAuth = async (
  data: OAuthRequest
): Promise<LoginPublic> => {
  const response = await publicClient.post('/auth/login/oauth', data);
  return response.data;
};
