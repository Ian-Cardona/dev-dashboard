import { useQuery } from '@tanstack/react-query';
import { getByProject } from '../api/todosApi';

const useQueryProjectTodos = (projectName: string) => {
  return useQuery({
    queryKey: ['todos', 'project', projectName],
    queryFn: () => getByProject(projectName),
    enabled: !!projectName,
  });
};

export default useQueryProjectTodos;
