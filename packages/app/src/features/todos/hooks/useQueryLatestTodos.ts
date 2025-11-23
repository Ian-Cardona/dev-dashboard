import { fetchLatestTodos } from '../api/todosApi';
import { useQuery } from '@tanstack/react-query';

const useQueryLatestTodos = () => {
  return useQuery({
    queryKey: ['todos', 'latest'],
    queryFn: () => fetchLatestTodos(),
    staleTime: 3 * 60 * 1000,
    retry: 1,
    retryDelay: 10000,
  });
};

export default useQueryLatestTodos;
