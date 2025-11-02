import { publicClient } from '../../../lib/api';
import type {
  LoginPublic,
  RegisterInitEmailRequest,
  RegistrationInfoRequest,
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

export const fetchOAuthSessionById = async (
  sessionId: string
): Promise<{ createdAt: number }> => {
  if (!sessionId) throw new Error('OAuth session ID is required for fetching.');

  const response = await publicClient.get(
    `/init/oauth/session?session=${sessionId}`
  );
  return response.data;
};

export const registerInitEmail = async (
  data: RegisterInitEmailRequest
): Promise<void> => {
  const response = await publicClient.post('/init/email', data);
  if (response.status !== 201) throw new Error('Failed to initiate register');
};

export const registerInitGithub = async (): Promise<void> => {
  const response = await publicClient.post('/init/github');
  if (response.status !== 201) console.log('response status', response.status);
  throw new Error('Failed to initialize OAuth registration.');
};

export const completeRegistrationEmail = async (
  data: RegistrationInfoRequest
): Promise<LoginPublic> => {
  const response = await publicClient.post('/auth/register/email', data);
  return response.data;
};

export const completeRegistrationOAuth = async (
  data: RegistrationInfoRequest
): Promise<LoginPublic> => {
  const response = await publicClient.post('/auth/register/oauth', data);
  return response.data;
};
