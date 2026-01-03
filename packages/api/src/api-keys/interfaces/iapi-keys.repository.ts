import { ApiKey, SafeApiKey } from '@dev-dashboard/shared';

export interface IApiKeysRepository {
  create(data: ApiKey): Promise<ApiKey>;
  findById(id: string): Promise<ApiKey | null>;
  findByUserId(userId: string): Promise<SafeApiKey[]>;
  revoke(userId: string, id: string): Promise<void>;
}
