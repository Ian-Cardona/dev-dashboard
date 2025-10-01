import { createKey } from '../api/apiKeysApi';
import type { CreateApiKey } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';

export const useMutateCreateKey = () => {
  return useMutation({
    mutationKey: ['api-keys', 'create'],
    mutationFn: (data: CreateApiKey) => createKey(data),
  });
};
