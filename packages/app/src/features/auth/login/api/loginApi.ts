import { api } from '../../../../lib/api';
import type { AuthenticationSuccessResponse } from '../../../../../../shared/types/auth.type';

export const loginApi = async (
  email: string,
  password: string
): Promise<AuthenticationSuccessResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};
