import { fetchTodosByProject } from '../api/todosApi';
import { useQuery } from '@tanstack/react-query';

const useQueryProjectTodos = (projectName: string) => {
  return useQuery({
    queryKey: ['todos', 'project', projectName],
    queryFn: () => fetchTodosByProject(projectName),
    enabled: !!projectName,
    staleTime: 3 * 60 * 1000,
    retry: 1,
    retryDelay: 10000,
  });
};

export default useQueryProjectTodos;
