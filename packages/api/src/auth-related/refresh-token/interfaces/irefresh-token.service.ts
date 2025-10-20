import {
  RefreshToken,
  RefreshTokenRecordAndPlain,
} from '@dev-dashboard/shared';

export interface IRefreshTokenService {
  create(userId: string): Promise<RefreshTokenRecordAndPlain>;
  findById(id: string): Promise<RefreshToken | null>;
  findByIdAndMatch(
    id: string,
    refreshTokenPlain: string
  ): Promise<RefreshToken | null>;
  tombstone(token: RefreshToken): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<number>;
}
