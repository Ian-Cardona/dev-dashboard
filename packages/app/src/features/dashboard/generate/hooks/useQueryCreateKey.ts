import { useQuery } from '@tanstack/react-query';
import * as apiKeysApi from '../api/apiKeysApi';

export const useQueryCreateKey = () => {
  return useQuery({
    queryKey: ['api-keys', 'create'],
    queryFn: () => apiKeysApi.createKey(),
    gcTime: Infinity,
    enabled: false,
  });
};
