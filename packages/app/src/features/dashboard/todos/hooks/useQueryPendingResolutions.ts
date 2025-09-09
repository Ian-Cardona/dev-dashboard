import { useQuery } from '@tanstack/react-query';
import * as todosApi from '../api/todosApi';

export const useQueryPendingResolutions = () => {
  return useQuery({
    queryKey: ['todos', 'resolutions', 'pending'],
    queryFn: () => todosApi.getPendingResolutions(),
    enabled: false,
  });
};
