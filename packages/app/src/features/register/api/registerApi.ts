import { publicClient } from '../../../lib/api';
import type {
  AuthenticationResponsePublic,
  OnboardingInfoRequest,
  RegisterInitEmailRegisterRequest,
  RegisterGithubAuthLinkResponse,
  RegisterInitOAuthRegisterRequest,
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

export const fetchRegisterInitGithub =
  async (): Promise<RegisterGithubAuthLinkResponse> => {
    const response = await publicClient.get('/init/github/authorize');
    return response.data;
  };

export const registerInitOAuth = async (
  data: RegisterInitOAuthRegisterRequest
): Promise<void> => {
  const response = await publicClient.post('/init/oauth', data);
  if (response.status !== 201)
    throw new Error('Failed to initialize OAuth registration.');
};

export const registerInitEmail = async (
  data: RegisterInitEmailRegisterRequest
): Promise<void> => {
  const response = await publicClient.post('/init/email', data);
  if (response.status !== 201) throw new Error('Failed to initiate register');
};

export const registerEmail = async (
  data: OnboardingInfoRequest
): Promise<AuthenticationResponsePublic> => {
  const response = await publicClient.post('/auth/register/email', data);
  return response.data;
};

export const registerOauth = async (
  data: OnboardingInfoRequest
): Promise<AuthenticationResponsePublic> => {
  const response = await publicClient.post('/auth/register/oauth', data);
  return response.data;
};
