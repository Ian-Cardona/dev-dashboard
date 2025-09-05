import type { ApiKeyPublic } from '@dev-dashboard/shared';
import { protectedClient } from '../../../../lib/api';

const createKey = async (): Promise<ApiKeyPublic> => {
  const response = await protectedClient.post<ApiKeyPublic>('/api-keys/create');
  return response.data;
};

export { createKey };
