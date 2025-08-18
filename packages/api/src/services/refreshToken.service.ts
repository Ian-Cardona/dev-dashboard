import { logger } from '../middlewares/logger.middleware';
import { IRefreshTokenModel } from '../models/refreshToken.model';
import { RefreshToken } from '../../../shared/types/refreshToken.type';
import { ConflictError, DatabaseError } from '../utils/errors.utils';
import { generateSecureRefreshToken, generateUUID } from '../utils/uuid.utils';
import { ENV } from '../config/env_variables';
import bcrypt from 'bcryptjs';

export interface IRefreshTokenService {
  create(
    userId: string
  ): Promise<{ refreshToken: string; refreshTokenRecord: RefreshToken }>;
  findByUserAndMatch(
    userId: string,
    refreshTokenPlain: string
  ): Promise<RefreshToken | null>;
  deleteToken(userId: string, refreshTokenId: string): Promise<void>;
  deleteAllUserTokens(userId: string): Promise<void>;
  deleteExpiredTokens(): Promise<number>;
}

export const RefreshTokenService = (
  refreshTokenModel: IRefreshTokenModel
): IRefreshTokenService => {
  return {
    async create(
      userId: string
    ): Promise<{ refreshToken: string; refreshTokenRecord: RefreshToken }> {
      const refreshTokenPlain = generateSecureRefreshToken();

      const salt = await bcrypt.genSalt(Number(ENV.BCRYPT_SALT_ROUNDS_RT));
      const refreshTokenHash = await bcrypt.hash(refreshTokenPlain, salt);

      const expiresAt = new Date();
      expiresAt.setDate(
        expiresAt.getDate() + Number(ENV.REFRESH_TOKEN_EXPIRES_IN)
      );

      const tokenToStore: RefreshToken = {
        userId,
        refreshTokenId: generateUUID(),
        refreshTokenHash,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        revoked: false,
      };

      try {
        const createdToken = await refreshTokenModel.create(tokenToStore);
        return {
          refreshToken: refreshTokenPlain,
          refreshTokenRecord: createdToken,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new ConflictError(
            `Refresh token ${tokenToStore.refreshTokenId} already exists`
          );
        }
        logger.error('Refresh token creation failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          tokenToStore,
        });
        throw new DatabaseError('Failed to create refresh token');
      }
    },

    async findByUserAndMatch(
      userId: string,
      refreshTokenPlain: string
    ): Promise<RefreshToken | null> {
      try {
        const refreshTokensFromDB =
          await refreshTokenModel.findByUserId(userId);

        if (!refreshTokensFromDB || refreshTokensFromDB.length === 0)
          return null;

        for (const token of refreshTokensFromDB) {
          if (
            !token.revoked &&
            new Date(token.expiresAt).getTime() > Date.now() &&
            (await bcrypt.compare(refreshTokenPlain, token.refreshTokenHash))
          ) {
            return token;
          }
        }

        return null;
      } catch (error) {
        logger.error('Service Error: Failed to retrieve refresh token', {
          error: error instanceof Error ? error.message : error,
          userId,
        });
        throw new DatabaseError('Failed to find refresh token');
      }
    },

    async deleteToken(userId: string, refreshTokenId: string): Promise<void> {
      try {
        await refreshTokenModel.deleteToken(userId, refreshTokenId);
      } catch (error) {
        if (error instanceof Error) {
          logger.error('Service Error: Failed to delete refresh token', {
            error: error.message,
            stack: error.stack,
            userId,
            refreshTokenId,
          });
        }
        throw new DatabaseError('Failed to delete refresh token');
      }
    },

    async deleteAllUserTokens(userId: string): Promise<void> {
      try {
        await refreshTokenModel.deleteAllUserTokens(userId);
      } catch (error) {
        if (error instanceof Error) {
          logger.error('Service Error: Failed to delete all user tokens', {
            error: error.message,
            stack: error.stack,
            userId,
          });
        }
        throw new DatabaseError('Failed to delete all user tokens');
      }
    },

    // TODO: Create a Lambda/ Scheduled Job/ TTL for deletion of expired tokens
    async deleteExpiredTokens(): Promise<number> {
      try {
        return await refreshTokenModel.deleteExpiredTokens();
      } catch (error) {
        if (error instanceof Error) {
          logger.error('Service Error: Failed to delete expired tokens', {
            error: error.message,
            stack: error.stack,
          });
        }
        throw new DatabaseError('Failed to delete expired tokens');
      }
    },
  };
};
