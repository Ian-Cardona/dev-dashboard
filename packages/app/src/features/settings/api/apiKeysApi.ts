import { protectedClient } from '../../../lib/api/protectedClient';
import type { ApiKeyPublic, CreateApiKey } from '@dev-dashboard/shared';

const createKey = async (data: CreateApiKey): Promise<ApiKeyPublic> => {
  const response = await protectedClient.post<ApiKeyPublic>(
    '/api-keys/create',
    data
  );
  return response.data;
};

const fetchKeys = async (): Promise<ApiKeyPublic[]> => {
  const response = await protectedClient.get<ApiKeyPublic[]>('/api-keys/list');
  return response.data;
};

export { createKey, fetchKeys };
