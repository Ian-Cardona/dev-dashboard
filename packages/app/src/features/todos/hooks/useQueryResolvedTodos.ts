import { fetchResolvedTodos } from '../api/todosApi';
import { useQuery } from '@tanstack/react-query';

const useQueryResolvedTodos = () => {
  return useQuery({
    queryKey: ['todos', 'resolved'],
    queryFn: () => fetchResolvedTodos(),
    staleTime: 3 * 60 * 1000,
    retry: 1,
    retryDelay: 10000,
  });
};

export default useQueryResolvedTodos;
