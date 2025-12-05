import { ApiKey, ApiKeyPublic } from '@dev-dashboard/shared';

export interface IApiKeysService {
  create(userId: string, description: string): Promise<ApiKeyPublic>;
  validate(pkey: string): Promise<ApiKey>;
  findByUserId(userId: string): Promise<ApiKey[]>;
  revoke(userId: string, id: string): Promise<void>;
}
