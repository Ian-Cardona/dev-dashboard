import { protectedClient } from './api';
import { RawTodo } from './scan';

export const todosApi = {
  syncTodos: async (todos: RawTodo[]) => {
    const response = await protectedClient.post('/todos/sync', { todos });
    return response.data;
  },
};
