import type { TodosInfo } from '../../../../../shared/src/types/todo.type';
import { protectedClient } from '../../../lib/api';

const getLatestTodos = async (): Promise<TodosInfo> => {
  const response = await protectedClient.get('/todos/latest');
  return response.data;
};

export { getLatestTodos };
