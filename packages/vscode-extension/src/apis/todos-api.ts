import { protectedClient } from '../lib/api';
import { RawTodoBatch } from '@dev-dashboard/shared';

export const todosApi = {
  send: async (todos: RawTodoBatch) => {
    const response = await protectedClient.post('/todos/batches', todos);
    return response.data;
  },
};
