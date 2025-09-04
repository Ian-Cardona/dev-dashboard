import { useQuery } from '@tanstack/react-query';
import * as todosApi from '../api/todosApi';

export const useQueryProjectNames = () => {
  return useQuery({
    queryKey: ['projectNames'],
    queryFn: () => todosApi.getProjectNames(),
  });
};
