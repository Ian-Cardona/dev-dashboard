import { useQuery } from '@tanstack/react-query';
import { getProjectNames } from '../api/todosApi';

const useQueryProjectNames = () => {
  return useQuery({
    queryKey: ['todos', 'project', 'names'],
    queryFn: () => getProjectNames(),
  });
};

export default useQueryProjectNames;
