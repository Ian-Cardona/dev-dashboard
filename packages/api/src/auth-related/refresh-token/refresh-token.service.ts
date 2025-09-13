import { IRefreshTokenModel } from './refresh-token.model';
import {
  RefreshToken,
  RefreshTokenRecordAndPlain,
} from '@dev-dashboard/shared';
import { ConflictError } from '../../utils/errors.utils';
import { generateRefreshToken, generateUUID } from '../../utils/uuid.utils';
import { ENV } from '../../config/env_variables';
import bcrypt from 'bcryptjs';

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

export const RefreshTokenService = (
  refreshTokenModel: IRefreshTokenModel
): IRefreshTokenService => {
  return {
    async create(userId: string): Promise<RefreshTokenRecordAndPlain> {
      const tokenPlain = generateRefreshToken();

      const salt = await bcrypt.genSalt(Number(ENV.BCRYPT_SALT_ROUNDS_RT));

      const tokenHash = await bcrypt.hash(tokenPlain, salt);

      const expiresAt = new Date();
      expiresAt.setDate(
        expiresAt.getDate() + Number(ENV.REFRESH_TOKEN_EXPIRES_IN)
      );

      const tokenToStore: RefreshToken = {
        userId,
        id: generateUUID(),
        hash: tokenHash,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        revoked: false,
      };

      try {
        const createdToken = await refreshTokenModel.create(tokenToStore);

        const tokenRecords: RefreshTokenRecordAndPlain = {
          plain: tokenPlain,
          record: createdToken,
        };

        return tokenRecords;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new ConflictError('Refresh token already exists');
        }
        throw new Error('Failed to create refresh token');
      }
    },

    async findById(id: string): Promise<RefreshToken | null> {
      try {
        return await refreshTokenModel.findById(id);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Something went wrong');
      }
    },

    async findByIdAndMatch(
      id: string,
      tokenPlain: string
    ): Promise<RefreshToken | null> {
      try {
        const tokensFromDb = await refreshTokenModel.findById(id);

        if (!tokensFromDb) return null;

        if (
          !tokensFromDb.revoked &&
          new Date(tokensFromDb.expiresAt).getTime() > Date.now() &&
          (await bcrypt.compare(tokenPlain, tokensFromDb.hash))
        ) {
          return tokensFromDb;
        }

        return null;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Something went wrong');
      }
    },

    async tombstone(token: RefreshToken): Promise<void> {
      try {
        const tokenToTombstone = {
          ...token,
          revoked: true,
          revokedAt: new Date().toISOString(),
        };
        await refreshTokenModel.tombstone(tokenToTombstone);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Something went wrong');
      }
    },

    async deleteAllByUserId(userId: string): Promise<void> {
      try {
        await refreshTokenModel.deleteAllByUserId(userId);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Something went wrong');
      }
    },

    // TODO: Create a Lambda/ Scheduled Job/ TTL for deletion of expired tokens
    async deleteExpired(): Promise<number> {
      try {
        return await refreshTokenModel.deleteExpired();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Something went wrong');
      }
    },
  };
};
