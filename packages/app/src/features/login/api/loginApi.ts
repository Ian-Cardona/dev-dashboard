import type {
  AuthenticationLoginRequestPublic,
  AuthenticationResponsePublic,
} from '../../../../../shared/src/types/auth.type';
import { publicClient } from '../../../lib/api';

export const loginApi = async (
  data: AuthenticationLoginRequestPublic
): Promise<AuthenticationResponsePublic> => {
  const response = await publicClient.post('/auth/login', data);
  return response.data;
};
