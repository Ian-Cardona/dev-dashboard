import { useQuery } from '@tanstack/react-query';
import { getPendingResolutions } from '../api/todosApi';

const useQueryPendingResolutions = () => {
  return useQuery({
    queryKey: ['todos', 'resolutions', 'pending'],
    queryFn: () => getPendingResolutions(),
  });
};

export default useQueryPendingResolutions;
