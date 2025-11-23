import { fetchProjectNames } from '../api/todosApi';
import { useQuery } from '@tanstack/react-query';

const useQueryProjectNames = () => {
  return useQuery({
    queryKey: ['todos', 'project', 'names'],
    queryFn: () => fetchProjectNames(),
    staleTime: 3 * 60 * 1000,
    retry: 1,
    retryDelay: 10000,
  });
};

export default useQueryProjectNames;
