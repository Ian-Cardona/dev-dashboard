import { publicClient } from '../../../lib/api';
import { getConfig } from '../../../utils/configs/getConfig';
import type {
  LoginPublic,
  RegisterInitEmailRequest,
  RegistrationInfoRequest,
} from '@dev-dashboard/shared';

const getRegisterInitEndpoints = () => getConfig().REGISTER_INIT_ENDPOINTS;
const getAuthenticationEndpoints = () => getConfig().AUTHENTICATION_ENDPOINTS;

export const fetchEmailSessionById = async (
  sessionId: string
): Promise<{ email: string }> => {
  if (!sessionId) throw new Error('Email session ID is required for fetching.');

  const response = await publicClient.get(
    `${getRegisterInitEndpoints().email_session}?session=${sessionId}`
  );
  return response.data;
};

export const fetchOAuthSessionById = async (
  sessionId: string
): Promise<{ createdAt: number }> => {
  if (!sessionId) throw new Error('OAuth session ID is required for fetching.');

  const response = await publicClient.get(
    `${getRegisterInitEndpoints().oauth_session}?session=${sessionId}`
  );
  return response.data;
};

export const registerInitEmail = async (
  data: RegisterInitEmailRequest
): Promise<void> => {
  const response = await publicClient.post(
    getRegisterInitEndpoints().email,
    data
  );
  if (response.status !== 201) throw new Error('Failed to initiate register');
};

export const registerInitGithub = async (): Promise<void> => {
  const response = await publicClient.post(getRegisterInitEndpoints().github);
  if (response.status !== 201) console.log('response status', response.status);
  throw new Error('Failed to initialize OAuth registration.');
};

export const completeRegistrationEmail = async (
  data: RegistrationInfoRequest
): Promise<LoginPublic> => {
  const response = await publicClient.post(
    getAuthenticationEndpoints().register_email,
    data
  );
  return response.data;
};

export const completeRegistrationOAuth = async (
  data: RegistrationInfoRequest
): Promise<LoginPublic> => {
  const response = await publicClient.post(
    getAuthenticationEndpoints().register_oauth,
    data
  );
  return response.data;
};
