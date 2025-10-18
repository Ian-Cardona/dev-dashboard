import type {
  AuthenticationLoginRequestPublic,
  AuthenticationResponsePublic,
} from '../../../../../shared/src/types/auth.type';
import { publicClient } from '../../../lib/api';

export const loginByEmail = async (
  data: AuthenticationLoginRequestPublic
): Promise<AuthenticationResponsePublic> => {
  const response = await publicClient.post('/auth/login/email', data);
  return response.data;
};

export const loginByOAuth = async (
  data: AuthenticationLoginRequestPublic
): Promise<AuthenticationResponsePublic> => {
  const response = await publicClient.post('/auth/login', data);
  return response.data;
};