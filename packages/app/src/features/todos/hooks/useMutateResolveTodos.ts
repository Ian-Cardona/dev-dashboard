import { useMutation } from '@tanstack/react-query';
import type { CreateResolution, TodoResolution } from '@dev-dashboard/shared';
import { postResolutions } from '../api/todosApi';

const useMutateResolveTodos = () => {
  return useMutation<TodoResolution[], Error, CreateResolution[]>({
    mutationFn: data => postResolutions(data),
  });
};

export default useMutateResolveTodos;
