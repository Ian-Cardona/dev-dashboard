import { ApiKey, ApiKeyPublic } from '@dev-dashboard/shared';

export interface IApiKeysService {
  create(userId: string, description: string): Promise<ApiKeyPublic>;
  validate(pkey: string): Promise<ApiKey>;
  // findById(id: string): Promise<ApiKey | null>;
  findByUserId(userId: string): Promise<ApiKey[]>;
  // revoke(id: string): Promise<void>;
  // updateLastUsed(id: string, timestamp: string): Promise<ApiKey>;
}
