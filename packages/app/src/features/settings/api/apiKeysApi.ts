import { protectedClient } from '../../../lib/api';
import type { ApiKeyPublic } from '@dev-dashboard/shared';

const createKey = async (): Promise<ApiKeyPublic> => {
  const response = await protectedClient.post<ApiKeyPublic>('/api-keys/create');
  return response.data;
};

const fetchKeys = async (): Promise<ApiKeyPublic[]> => {
  const response = await protectedClient.get<ApiKeyPublic[]>('/api-keys/list');
  return response.data;
};

export { createKey, fetchKeys };
