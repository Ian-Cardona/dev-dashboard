import { useQuery } from '@tanstack/react-query';
import * as todosApi from '../api/todosApi';

export const useQueryProjectNames = () => {
  return useQuery({
    queryKey: ['todos', 'project', 'names'],
    queryFn: () => todosApi.getProjectNames(),
  });
};
