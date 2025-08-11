import { logger } from '../middlewares/logger.middleware';
import { IRefreshTokenModel } from '../models/refreshToken.model';
import { RefreshToken } from '../types/refreshToken.type';
import { ConflictError, DatabaseError } from '../utils/errors.utils';
import { generateUUID } from '../utils/uuid.utils';

export interface IRefreshTokenService {
  create(
    refreshToken: Omit<RefreshToken, 'refreshTokenId' | 'createdAt'>
  ): Promise<RefreshToken>;
  findByUserAndToken(
    userId: string,
    refreshTokenId: string
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
      refreshToken: Omit<RefreshToken, 'refreshTokenId' | 'createdAt'>
    ): Promise<RefreshToken> {
      const tokenToStore: RefreshToken = {
        ...refreshToken,
        refreshTokenId: generateUUID(),
        createdAt: new Date().toISOString(),
      };
      try {
        const result = refreshTokenModel.create(tokenToStore);
        return await result;
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

    async findByUserAndToken(
      userId: string,
      refreshTokenId: string
    ): Promise<RefreshToken | null> {
      try {
        return await refreshTokenModel.findByUserAndToken(
          userId,
          refreshTokenId
        );
      } catch (error) {
        if (error instanceof Error) {
          logger.error('Service Error: Failed to retrieve refresh token', {
            error: error.message,
            stack: error.stack,
            userId,
            refreshTokenId,
          });
        }
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
