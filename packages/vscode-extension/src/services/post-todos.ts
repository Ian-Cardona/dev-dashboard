import { RawTodoBatch } from '@dev-dashboard/shared';
import { todosApi } from '../apis/todos-api';

export const postTodos = async (todos: RawTodoBatch) => {
  try {
    await todosApi.send(todos);
  } catch (error) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'Unknown error';
    }
    throw new Error(errorMessage);
  }
};
