import { ApiKey } from '@dev-dashboard/shared';

export interface IApiKeysRepository {
  create(data: ApiKey): Promise<ApiKey>;
  findById(id: string): Promise<ApiKey | null>;
  findByUserId(userId: string): Promise<ApiKey[]>;
  revoke(userId: string, id: string): Promise<void>;
}
