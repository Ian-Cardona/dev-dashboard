import { publicClient } from '../../../lib/api/publicClient';
import { getConfig } from '../../../lib/configs/getConfig';
import type {
  LoginPublic,
  RegisterInitEmailRequest,
  RegistrationInfoRequest,
} from '@dev-dashboard/shared';

const getRegisterInitEndpoints = () => getConfig().REGISTER_INIT_ENDPOINTS;
const getAuthenticationEndpoints = () => getConfig().AUTHENTICATION_ENDPOINTS;

const isEmailSessionResponse = (data: unknown): data is { email: string } => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as { email?: unknown }).email === 'string' &&
    (data as { email: string }).email.length > 0
  );
};

const isOAuthSessionResponse = (
  data: unknown
): data is { createdAt: number } => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as { createdAt?: unknown }).createdAt === 'number'
  );
};

export const fetchEmailSessionById = async (
  sessionId: string
): Promise<{ email: string }> => {
  if (!sessionId || sessionId.trim() === '') {
    throw new Error('Valid email session ID is required for fetching.');
  }

  const response = await publicClient.get(
    `${getRegisterInitEndpoints().email_session}?session=${sessionId}`
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch email session: ${response.status}`);
  }

  if (!isEmailSessionResponse(response.data)) {
    throw new Error('Invalid email session response format');
  }

  return response.data;
};

export const fetchOAuthSessionById = async (
  sessionId: string
): Promise<{ createdAt: number }> => {
  if (!sessionId || sessionId.trim() === '') {
    throw new Error('Valid OAuth session ID is required for fetching.');
  }

  const response = await publicClient.get(
    `${getRegisterInitEndpoints().oauth_session}?session=${sessionId}`
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch OAuth session: ${response.status}`);
  }

  if (!isOAuthSessionResponse(response.data)) {
    throw new Error('Invalid OAuth session response format');
  }

  return response.data;
};

export const registerInitEmail = async (
  data: RegisterInitEmailRequest
): Promise<{ registrationId: string }> => {
  const response = await publicClient.post(
    getRegisterInitEndpoints().email,
    data
  );

  if (response.status !== 201) {
    throw new Error(`Failed to initiate register: ${response.status}`);
  }

  return response.data;
};

export const registerInitGithub = async (): Promise<void> => {
  const response = await publicClient.post(getRegisterInitEndpoints().github);

  if (response.status !== 201) {
    throw new Error(
      `Failed to initialize OAuth registration: ${response.status}`
    );
  }
};

export const completeRegistrationEmail = async (
  data: RegistrationInfoRequest
): Promise<LoginPublic> => {
  const response = await publicClient.post(
    getAuthenticationEndpoints().register_email,
    data
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Registration failed: ${response.status}`);
  }

  if (!response.data || typeof response.data !== 'object') {
    throw new Error('Invalid registration response format');
  }

  return response.data;
};

export const completeRegistrationOAuth = async (
  data: RegistrationInfoRequest
): Promise<LoginPublic> => {
  const response = await publicClient.post(
    getAuthenticationEndpoints().register_oauth,
    data
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`OAuth registration failed: ${response.status}`);
  }

  if (!response.data || typeof response.data !== 'object') {
    throw new Error('Invalid registration response format');
  }

  return response.data;
};
