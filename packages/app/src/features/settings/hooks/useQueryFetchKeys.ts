import { fetchKeys } from '../api/apiKeysApi';
import { useQuery } from '@tanstack/react-query';

export const useQueryFetchKeys = () => {
  return useQuery({
    queryKey: ['api-keys', 'list'],
    queryFn: () => fetchKeys(),
  });
};
