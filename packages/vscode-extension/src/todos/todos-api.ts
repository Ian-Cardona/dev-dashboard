import { RawTodo } from '@dev-dashboard/shared';
import { protectedClient } from '../lib/api';

export const todosApi = {
  syncTodos: async (todos: RawTodo[]) => {
    const response = await protectedClient.post('/todos', { todos });
    console.log('Response', response);
    return response.data;
  },
};
