import type {
  AuthenticationLoginRequest,
  AuthenticationSuccessResponse,
} from '../../../../../shared/types/auth.type';
import { client } from '../../../lib/api';

export const loginApi = async (
  data: AuthenticationLoginRequest
): Promise<AuthenticationSuccessResponse> => {
  const response = await client.post('/auth/login', data);
  return response.data;
};
