import { getPendingResolutions } from '../api/todosApi';
import { useQuery } from '@tanstack/react-query';

const useQueryPendingResolutions = () => {
  return useQuery({
    queryKey: ['todos', 'resolutions', 'pending'],
    queryFn: () => getPendingResolutions(),
  });
};

export default useQueryPendingResolutions;
