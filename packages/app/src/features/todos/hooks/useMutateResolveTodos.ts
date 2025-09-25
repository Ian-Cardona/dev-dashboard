import { postResolutions } from '../api/todosApi';
import type { CreateResolution, TodoResolution } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';

const useMutateResolveTodos = () => {
  return useMutation<TodoResolution[], Error, CreateResolution[]>({
    mutationFn: data => postResolutions(data),
  });
};

export default useMutateResolveTodos;
