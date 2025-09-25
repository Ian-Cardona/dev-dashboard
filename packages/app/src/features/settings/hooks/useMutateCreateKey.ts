import { createKey } from '../api/apiKeysApi';
import { useMutation } from '@tanstack/react-query';

export const useMutateCreateKey = () => {
  return useMutation({
    mutationKey: ['api-keys', 'create'],
    mutationFn: () => createKey(),
  });
};
