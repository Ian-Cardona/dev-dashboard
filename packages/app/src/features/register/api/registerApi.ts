import type {
  AuthenticationRegisterRequest,
  AuthenticationSuccessResponse,
} from '../../../../../shared/types/auth.type';
import { client } from '../../../lib/api';

export const registerApi = async (
  data: AuthenticationRegisterRequest
): Promise<AuthenticationSuccessResponse> => {
  const response = await client.post('/auth/register', data);
  return response.data;
};
