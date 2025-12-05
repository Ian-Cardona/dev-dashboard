import { fetchProviders } from '../api/connections';
import { useQuery } from '@tanstack/react-query';

export const useQueryFetchProviders = () => {
  return useQuery({
    queryKey: ['connections', 'list'],
    queryFn: () => fetchProviders(),
  });
};
