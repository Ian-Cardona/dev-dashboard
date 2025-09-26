import { getResolved } from '../api/todosApi';
import { useQuery } from '@tanstack/react-query';

const useQueryResolved = () => {
  return useQuery({
    queryKey: ['todos', 'resolved'],
    queryFn: () => getResolved(),
  });
};

export default useQueryResolved;
