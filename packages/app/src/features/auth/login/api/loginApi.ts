import { api } from '../../../../lib/api';
import type {
  AuthenticationLoginRequest,
  AuthenticationSuccessResponse,
} from '../../../../../../shared/types/auth.type';

export const loginApi = async (
  data: AuthenticationLoginRequest
): Promise<AuthenticationSuccessResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};
