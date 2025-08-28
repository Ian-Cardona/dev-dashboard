import { RawTodoBaseSchema } from '@dev-dashboard/shared';
import { protectedClient } from './api';

export const todosApi = {
  syncTodos: async (todos: RawTodoBaseSchema[]) => {
    const response = await protectedClient.post('/todos/sync', { todos });
    return response.data;
  },
};
