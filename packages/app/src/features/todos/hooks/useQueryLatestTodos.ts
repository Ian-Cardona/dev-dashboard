import { useQuery } from '@tanstack/react-query';
import { getLatest } from '../api/todosApi';

const useQueryLatestTodos = () => {
  return useQuery({
    queryKey: ['todos', 'latest'],
    queryFn: () => getLatest(),
  });
};

export default useQueryLatestTodos;
