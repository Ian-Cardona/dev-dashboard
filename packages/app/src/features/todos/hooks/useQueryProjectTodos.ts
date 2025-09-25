import { getByProject } from '../api/todosApi';
import { useQuery } from '@tanstack/react-query';

const useQueryProjectTodos = (projectName: string) => {
  return useQuery({
    queryKey: ['todos', 'project', projectName],
    queryFn: () => getByProject(projectName),
    enabled: !!projectName,
  });
};

export default useQueryProjectTodos;
