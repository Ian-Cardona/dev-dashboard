import { useMutation } from '@tanstack/react-query';
import * as todosApi from '../api/todosApi';
import type { CreateResolution, TodoResolution } from '@dev-dashboard/shared';

export const useMutateResolveTodos = () => {
  return useMutation<TodoResolution[], Error, CreateResolution[]>({
    mutationFn: data => todosApi.postResolutions(data),
  });
};
