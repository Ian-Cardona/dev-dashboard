import { logger } from '../middlewares/logger.middleware';
import { IRefreshTokenModel } from '../models/refreshToken.model';
import { RefreshToken } from '../types/refreshToken.type';
import { DatabaseError } from '../utils/errors.utils';

export interface IRefreshTokenService {
  create(refreshToken: RefreshToken): Promise<RefreshToken>;
  findByUserAndToken(
    userId: string,
    tokenId: string
  ): Promise<RefreshToken | null>;
  deleteToken(userId: string, tokenId: string): Promise<void>;
  deleteAllUserTokens(userId: string): Promise<void>;
  deleteExpiredTokens(): Promise<number>;
}

export const RefreshTokenService = (
  refreshTokenModel: IRefreshTokenModel
): IRefreshTokenService => {
  async function handleServiceCall<T>(
    fn: () => Promise<T>,
    context: object,
    errorMessage: string,
    errorClass = DatabaseError
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(errorMessage, {
          error: error.message,
          stack: error.stack,
          ...context,
        });
      }

      throw new errorClass(errorMessage);
    }
  }

  return {
    async create(refreshToken: RefreshToken): Promise<RefreshToken> {
      return handleServiceCall(
        async () => await refreshTokenModel.create(refreshToken),
        { refreshToken },
        'Could not create the refresh token.',
        DatabaseError
      );
    },

    async findByUserAndToken(
      userId: string,
      tokenId: string
    ): Promise<RefreshToken | null> {
      return handleServiceCall(
        async () => await refreshTokenModel.findByUserAndToken(userId, tokenId),
        { userId, tokenId },
        'Could not find the refresh token.',
        DatabaseError
      );
    },

    async deleteToken(userId: string, tokenId: string): Promise<void> {
      return handleServiceCall(
        async () => await refreshTokenModel.deleteToken(userId, tokenId),
        { userId, tokenId },
        'Could not delete the refresh token.',
        DatabaseError
      );
    },

    async deleteAllUserTokens(userId: string): Promise<void> {
      return handleServiceCall(
        async () => await refreshTokenModel.deleteAllUserTokens(userId),
        { userId },
        'Could not delete all user tokens.',
        DatabaseError
      );
    },

    async deleteExpiredTokens(): Promise<number> {
      return handleServiceCall(
        async () => await refreshTokenModel.deleteExpiredTokens(),
        {},
        'Could not delete expired tokens.',
        DatabaseError
      );
    },
  };
};
