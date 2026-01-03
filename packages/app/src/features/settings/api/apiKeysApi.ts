import { protectedClient } from '../../../lib/api/protectedClient';
import type {
  ApiKeyPublic,
  CreateApiKey,
  SafeApiKey,
} from '@dev-dashboard/shared';

export const createKey = async (data: CreateApiKey): Promise<ApiKeyPublic> => {
  const response = await protectedClient.post<ApiKeyPublic>(
    '/api-keys/create',
    data
  );
  return response.data as ApiKeyPublic;
};

export const fetchKeys = async (): Promise<SafeApiKey[]> => {
  const response = await protectedClient.get<SafeApiKey[]>('/api-keys/list');
  console.log('Fetched API keys:', response.data);
  return response.data as SafeApiKey[];
};

export const revokeKey = async (id: string): Promise<void> => {
  await protectedClient.put(`/api-keys/revoke/${id}`);
};
