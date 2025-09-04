import { useQuery } from '@tanstack/react-query';
import * as todosApi from '../api/todosApi';

export const useQueryProjectTodos = (projectName: string) => {
  return useQuery({
    queryKey: ['todos', 'project', projectName],
    queryFn: () => todosApi.getByProject(projectName),
    enabled: !!projectName,
  });
};
