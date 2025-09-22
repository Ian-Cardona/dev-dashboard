import { useMutation } from '@tanstack/react-query';
import { createKey } from '../api/apiKeysApi';

export const useMutateCreateKey = () => {
  return useMutation({
    mutationKey: ['api-keys', 'create'],
    mutationFn: () => createKey(),
  });
};
