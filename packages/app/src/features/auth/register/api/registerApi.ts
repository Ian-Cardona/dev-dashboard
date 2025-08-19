import type {
  AuthenticationRegisterRequest,
  AuthenticationSuccessResponse,
} from '../../../../../../shared/types/auth.type';
import { api } from '../../../../lib/api';

export const registerApi = async (
  data: AuthenticationRegisterRequest
): Promise<AuthenticationSuccessResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};
