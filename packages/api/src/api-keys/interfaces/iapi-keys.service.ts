import { ApiKey, ApiKeyPublic, SafeApiKey } from '@dev-dashboard/shared';

export interface IApiKeysService {
  create(userId: string, description: string): Promise<ApiKeyPublic>;
  validate(pkey: string): Promise<ApiKey>;
  findByUserId(userId: string): Promise<SafeApiKey[]>;
  revoke(userId: string, id: string): Promise<void>;
}
