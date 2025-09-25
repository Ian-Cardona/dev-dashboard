import { getLatest } from '../api/todosApi';
import { useQuery } from '@tanstack/react-query';

const useQueryLatestTodos = () => {
  return useQuery({
    queryKey: ['todos', 'latest'],
    queryFn: () => getLatest(),
  });
};

export default useQueryLatestTodos;
