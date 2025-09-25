import { publicClient } from '../../../lib/api';
import type {
  AuthenticationRegisterRequestPublicSchema,
  AuthenticationResponsePublicSchema,
} from '@dev-dashboard/shared';

export const registerApi = async (
  data: AuthenticationRegisterRequestPublicSchema
): Promise<AuthenticationResponsePublicSchema> => {
  const response = await publicClient.post('/auth/register', data);
  return response.data;
};
