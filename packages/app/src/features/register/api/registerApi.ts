import { publicClient } from '../../../lib/api';
import type {
  AuthenticationEmailRegisterRequest,
  AuthenticationResponsePublic,
  OnboardingInfoRequest,
  RegisterInitEmailRegisterRequest,
} from '@dev-dashboard/shared';

export const fetchEmailSessionById = async (
  sessionId: string
): Promise<{ email: string }> => {
  if (!sessionId) throw new Error('Email session ID is required for fetching.');

  const response = await publicClient.get(
    `/init/email/session?session=${sessionId}`
  );
  return response.data;
};

export const registerInitEmail = async (
  data: RegisterInitEmailRegisterRequest
): Promise<void> => {
  const response = await publicClient.post('/init/email', data);
  if (response.status !== 201) throw new Error('Failed to initiate register');
};

export const register = async (
  data: OnboardingInfoRequest
): Promise<AuthenticationResponsePublic> => {
  const response = await publicClient.post('/auth/register/email', data);
  return response.data;
};
