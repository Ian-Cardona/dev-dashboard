import { revokeKey } from '../api/apiKeysApi';
import { useMutation } from '@tanstack/react-query';

export const useMutateRevokeKey = () => {
  return useMutation({
    mutationKey: ['api-keys', 'revoke'],
    mutationFn: (id: string) => revokeKey(id),
  });
};
