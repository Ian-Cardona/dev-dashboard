import { useQuery } from '@tanstack/react-query';
import * as todosApi from '../api/todosApi';

export const useQueryLatestTodos = () => {
  return useQuery({
    queryKey: ['todos', 'latest'],
    queryFn: () => todosApi.getLatest(),
  });
};
