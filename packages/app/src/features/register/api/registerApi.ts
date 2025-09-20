import type {
  AuthenticationRegisterRequestPublicSchema,
  AuthenticationResponsePublicSchema,
} from '@dev-dashboard/shared';
import { publicClient } from '../../../lib/api';

export const registerApi = async (
  data: AuthenticationRegisterRequestPublicSchema
): Promise<AuthenticationResponsePublicSchema> => {
  const response = await publicClient.post('/auth/register', data);
  return response.data;
};
