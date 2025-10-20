import { RefreshToken } from '@dev-dashboard/shared';

export interface IRefreshTokenRepository {
  create(token: RefreshToken): Promise<RefreshToken>;
  findById(id: string): Promise<RefreshToken | null>;
  tombstone(token: RefreshToken): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<number>;
}
