import { fetchPendingResolutions } from '../api/todosApi';
import { useQuery } from '@tanstack/react-query';

const useQueryPendingResolutions = () => {
  return useQuery({
    queryKey: ['todos', 'resolutions', 'pending'],
    queryFn: () => fetchPendingResolutions(),
    staleTime: 3 * 60 * 1000,
    retry: 1,
    retryDelay: 10000,
  });
};

export default useQueryPendingResolutions;
