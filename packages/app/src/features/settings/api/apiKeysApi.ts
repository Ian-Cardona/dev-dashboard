import { protectedClient } from '../../../lib/api/protectedClient';
import type { ApiKeyPublic, CreateApiKey } from '@dev-dashboard/shared';

export const createKey = async (data: CreateApiKey): Promise<ApiKeyPublic> => {
  const response = await protectedClient.post<ApiKeyPublic>(
    '/api-keys/create',
    data
  );
  return response.data as ApiKeyPublic;
};

export const fetchKeys = async (): Promise<ApiKeyPublic[]> => {
  const response = await protectedClient.get<ApiKeyPublic[]>('/api-keys/list');
  return response.data as ApiKeyPublic[];
};

export const revokeKey = async (id: string): Promise<void> => {
  await protectedClient.put(`/api-keys/revoke/${id}`);
};
