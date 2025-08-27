import type {
  AuthenticationLoginRequestPublicSchema,
  AuthenticationResponsePublicSchema,
} from '../../../../../shared/src/types/auth.type';
import { publicClient } from '../../../lib/api';

export const loginApi = async (
  data: AuthenticationLoginRequestPublicSchema
): Promise<AuthenticationResponsePublicSchema> => {
  const response = await publicClient.post('/auth/login', data);
  return response.data;
};
