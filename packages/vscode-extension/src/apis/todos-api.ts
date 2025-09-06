import { RawTodoBatch } from '@dev-dashboard/shared';
import { protectedClient } from '../lib/api';

export const todosApi = {
  send: async (todos: RawTodoBatch) => {
    const response = await protectedClient.post('/todos', todos);
    console.log('Response', response);
    return response.data;
  },
};
