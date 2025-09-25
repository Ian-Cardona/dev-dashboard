import { getProjectNames } from '../api/todosApi';
import { useQuery } from '@tanstack/react-query';

const useQueryProjectNames = () => {
  return useQuery({
    queryKey: ['todos', 'project', 'names'],
    queryFn: () => getProjectNames(),
  });
};

export default useQueryProjectNames;
