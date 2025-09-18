import { useQuery } from '@tanstack/react-query';
import * as apiKeysApi from '../api/apiKeysApi';

export const useQueryFetchKeys = () => {
  return useQuery({
    queryKey: ['api-keys', 'list'],
    queryFn: () => apiKeysApi.fetchKeys(),
  });
};
