import { useMutation } from '@tanstack/react-query';
import * as apiKeysApi from '../api/apiKeysApi';

export const useMutateCreateKey = () => {
  return useMutation({
    mutationKey: ['api-keys', 'create'],
    mutationFn: () => apiKeysApi.createKey(),
  });
};
