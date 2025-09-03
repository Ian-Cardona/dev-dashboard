import type { TodosInfo } from '@dev-dashboard/shared';
import { protectedClient } from '../../../lib/api';

const getLatest = async (): Promise<TodosInfo> => {
  const response = await protectedClient.get('/todos/latest');
  return response.data;
};

export { getLatest };
