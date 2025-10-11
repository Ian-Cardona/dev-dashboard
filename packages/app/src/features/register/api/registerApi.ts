import { publicClient } from '../../../lib/api';
import type {
  AuthenticationEmailRegisterRequest,
  RegisterInitEmailRegisterRequest,
  AuthenticationResponsePublic,
} from '@dev-dashboard/shared';

export const registerInitEmail = async (
  data: RegisterInitEmailRegisterRequest
): Promise<void> => {
  const response = await publicClient.post('/init/email', data);
  if (response.status !== 201) throw new Error('Failed to initiate register');
};

export const registerApi = async (
  data: AuthenticationEmailRegisterRequest
): Promise<AuthenticationResponsePublic> => {
  const response = await publicClient.post('/auth/register/email', data);
  return response.data;
};
