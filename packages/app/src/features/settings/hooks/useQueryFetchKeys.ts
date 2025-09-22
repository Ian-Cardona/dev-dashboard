import { useQuery } from '@tanstack/react-query';
import { fetchKeys } from '../api/apiKeysApi';

export const useQueryFetchKeys = () => {
  return useQuery({
    queryKey: ['api-keys', 'list'],
    queryFn: () => fetchKeys(),
  });
};
