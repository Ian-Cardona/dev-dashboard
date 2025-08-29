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

// async findByToken(refreshTokenPlain: string): Promise<RefreshToken | null> {
//   try {
//     const refreshTokenHash =
//       await refreshTokenModel.findByToken(refreshTokenPlain);

//     if (!refreshTokenHash) return null;

//     if (
//       !refreshTokenHash.revoked &&
//       new Date(refreshTokenHash.expiresAt).getTime() > Date.now() &&
//       (await bcrypt.compare(
//         refreshTokenPlain,
//         refreshTokenHash.refreshTokenHash
//       ))
//     ) {
//       return refreshTokenHash;
//     }

//     return null;
//   } catch (error) {
//     logger.error('Service Error: Failed to retrieve refresh token', {
//       error: error instanceof Error ? error.message : error,
//       refreshTokenPlain,
//     });
//     throw new DatabaseError('Failed to find refresh token');
//   }
// },
// async findByUserAndMatch(
//   userId: string,
//   refreshTokenPlain: string
// ): Promise<RefreshToken | null> {
//   try {
//     const refreshTokensFromDB =
//       await refreshTokenModel.findByUserId(userId);

//     if (!refreshTokensFromDB || refreshTokensFromDB.length === 0)
//       return null;

//     for (const token of refreshTokensFromDB) {
//       if (
//         !token.revoked &&
//         new Date(token.expiresAt).getTime() > Date.now() &&
//         (await bcrypt.compare(refreshTokenPlain, token.refreshTokenHash))
//       ) {
//         return token;
//       }
//     }

//     return null;
//   } catch (error) {
//     logger.error('Service Error: Failed to retrieve refresh token', {
//       error: error instanceof Error ? error.message : error,
//       userId,
//     });
//     throw new DatabaseError('Failed to find refresh token');
//   }
// },

// async deleteToken(userId: string, refreshTokenId: string): Promise<void> {
//   try {
//     await refreshTokenModel.deleteToken(userId, refreshTokenId);
//   } catch (error) {
//     if (error instanceof Error) {
//       logger.error('Service Error: Failed to delete refresh token', {
//         error: error.message,
//         stack: error.stack,
//         userId,
//         refreshTokenId,
//       });
//     }
//     throw new DatabaseError('Failed to delete refresh token');
//   }
// },
