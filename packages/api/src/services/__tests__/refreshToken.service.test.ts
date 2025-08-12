import {
  vi,
  MockedFunction,
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
} from 'vitest';
import { RefreshTokenService } from '../refreshToken.service';
import { IRefreshTokenModel } from '../../models/refreshToken.model';
import { RefreshToken } from '../../types/refreshToken.type';
import { DatabaseError, ConflictError } from '../../utils/errors.utils';

const mockRefreshTokenModel = {
  create: vi.fn() as MockedFunction<IRefreshTokenModel['create']>,
  findByUserAndToken: vi.fn() as MockedFunction<
    IRefreshTokenModel['findByUserAndToken']
  >,
  deleteToken: vi.fn() as MockedFunction<IRefreshTokenModel['deleteToken']>,
  deleteAllUserTokens: vi.fn() as MockedFunction<
    IRefreshTokenModel['deleteAllUserTokens']
  >,
  deleteExpiredTokens: vi.fn() as MockedFunction<
    IRefreshTokenModel['deleteExpiredTokens']
  >,
};

const refreshTokenService = RefreshTokenService(mockRefreshTokenModel);

describe('RefreshToken Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('create', () => {
    const refreshTokenInput: Omit<
      RefreshToken,
      'refreshTokenId' | 'createdAt'
    > = {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      refreshTokenHash: '550e8400-e29b-41d4-a716-446655440002',
      expiresAt: '2025-01-01T00:00:00.000Z',
      revoked: false,
    };

    it('should successfully create a new RefreshToken and return it', async () => {
      mockRefreshTokenModel.create.mockImplementation(async tokenToStore => {
        return tokenToStore;
      });

      const result = await refreshTokenService.create(refreshTokenInput);

      expect(result).toMatchObject(refreshTokenInput);
      expect(result.refreshTokenId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(result.createdAt).toBe('2025-01-01T00:00:00.000Z');
      expect(result.revoked).toBe(false);

      expect(mockRefreshTokenModel.create).toHaveBeenCalledTimes(1);
      expect(mockRefreshTokenModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...refreshTokenInput,
          refreshTokenId: expect.stringMatching(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
          ),
          createdAt: '2025-01-01T00:00:00.000Z',
          revoked: false,
        })
      );
    });

    it('should handle ConflictError when token already exists', async () => {
      const conflictError = new Error(
        'ConditionalCheckFailedException: Item already exists'
      );
      mockRefreshTokenModel.create.mockRejectedValue(conflictError);

      await expect(
        refreshTokenService.create(refreshTokenInput)
      ).rejects.toThrow(ConflictError);

      expect(mockRefreshTokenModel.create).toHaveBeenCalledTimes(1);
    });

    it('should handle generic database error', async () => {
      const dbError = new Error('Database connection failed');
      mockRefreshTokenModel.create.mockRejectedValue(dbError);

      await expect(
        refreshTokenService.create(refreshTokenInput)
      ).rejects.toThrow(DatabaseError);

      expect(mockRefreshTokenModel.create).toHaveBeenCalledTimes(1);
    });

    it('should handle non-Error exceptions', async () => {
      mockRefreshTokenModel.create.mockRejectedValue('String error');

      await expect(
        refreshTokenService.create(refreshTokenInput)
      ).rejects.toThrow(DatabaseError);

      expect(mockRefreshTokenModel.create).toHaveBeenCalledTimes(1);
    });

    it('should set revoked to false by default', async () => {
      const inputWithRevoked = {
        ...refreshTokenInput,
        revoked: true, // This should be overridden
      };

      mockRefreshTokenModel.create.mockImplementation(async tokenToStore => {
        return tokenToStore;
      });

      const result = await refreshTokenService.create(inputWithRevoked);

      expect(result.revoked).toBe(false);
      expect(mockRefreshTokenModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ revoked: false })
      );
    });
  });

  describe('findByUserAndToken', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440001';
    const refreshTokenId = '550e8400-e29b-41d4-a716-446655440002';

    const refreshToken: RefreshToken = {
      userId,
      refreshTokenId,
      refreshTokenHash: '550e8400-e29b-41d4-a716-446655440003',
      expiresAt: '2025-01-01T00:00:00.000Z',
      createdAt: '2025-01-01T00:00:00.000Z',
      revoked: false,
    };

    it('should successfully find a RefreshToken by userId and refreshTokenId', async () => {
      mockRefreshTokenModel.findByUserAndToken.mockResolvedValue(refreshToken);

      const result = await refreshTokenService.findByUserAndToken(
        userId,
        refreshTokenId
      );

      expect(result).toEqual(refreshToken);
      expect(mockRefreshTokenModel.findByUserAndToken).toHaveBeenCalledWith(
        userId,
        refreshTokenId
      );
      expect(mockRefreshTokenModel.findByUserAndToken).toHaveBeenCalledTimes(1);
    });

    it('should return null when token not found', async () => {
      mockRefreshTokenModel.findByUserAndToken.mockResolvedValue(null);

      const result = await refreshTokenService.findByUserAndToken(
        userId,
        refreshTokenId
      );

      expect(result).toBeNull();
      expect(mockRefreshTokenModel.findByUserAndToken).toHaveBeenCalledWith(
        userId,
        refreshTokenId
      );
    });

    it('should handle database error', async () => {
      const dbError = new Error('Database connection failed');
      mockRefreshTokenModel.findByUserAndToken.mockRejectedValue(dbError);

      await expect(
        refreshTokenService.findByUserAndToken(userId, refreshTokenId)
      ).rejects.toThrow(DatabaseError);

      await expect(
        refreshTokenService.findByUserAndToken(userId, refreshTokenId)
      ).rejects.toThrow('Failed to find refresh token');
    });

    it('should handle non-Error exceptions', async () => {
      mockRefreshTokenModel.findByUserAndToken.mockRejectedValue(
        'String error'
      );

      await expect(
        refreshTokenService.findByUserAndToken(userId, refreshTokenId)
      ).rejects.toThrow(DatabaseError);
    });

    it('should validate input parameters', async () => {
      mockRefreshTokenModel.findByUserAndToken.mockResolvedValue(null);

      // Test with empty strings
      await refreshTokenService.findByUserAndToken('', '');
      expect(mockRefreshTokenModel.findByUserAndToken).toHaveBeenCalledWith(
        '',
        ''
      );

      // Test with whitespace
      await refreshTokenService.findByUserAndToken('  ', '  ');
      expect(mockRefreshTokenModel.findByUserAndToken).toHaveBeenCalledWith(
        '  ',
        '  '
      );
    });
  });

  describe('deleteToken', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440001';
    const refreshTokenId = '550e8400-e29b-41d4-a716-446655440002';

    it('should successfully delete a RefreshToken', async () => {
      mockRefreshTokenModel.deleteToken.mockResolvedValue(undefined);

      await refreshTokenService.deleteToken(userId, refreshTokenId);

      expect(mockRefreshTokenModel.deleteToken).toHaveBeenCalledWith(
        userId,
        refreshTokenId
      );
      expect(mockRefreshTokenModel.deleteToken).toHaveBeenCalledTimes(1);
    });

    it('should handle database error', async () => {
      const dbError = new Error('Database connection failed');
      mockRefreshTokenModel.deleteToken.mockRejectedValue(dbError);

      await expect(
        refreshTokenService.deleteToken(userId, refreshTokenId)
      ).rejects.toThrow(DatabaseError);

      await expect(
        refreshTokenService.deleteToken(userId, refreshTokenId)
      ).rejects.toThrow('Failed to delete refresh token');
    });

    it('should handle non-Error exceptions', async () => {
      mockRefreshTokenModel.deleteToken.mockRejectedValue('String error');

      await expect(
        refreshTokenService.deleteToken(userId, refreshTokenId)
      ).rejects.toThrow(DatabaseError);
    });

    it('should handle deletion of non-existent token gracefully', async () => {
      // Model should handle this case, service just passes through
      mockRefreshTokenModel.deleteToken.mockResolvedValue(undefined);

      await expect(
        refreshTokenService.deleteToken(
          'non-existent-user',
          'non-existent-token'
        )
      ).resolves.not.toThrow();
    });
  });

  describe('deleteAllUserTokens', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440001';

    it('should successfully delete all RefreshTokens for a user', async () => {
      mockRefreshTokenModel.deleteAllUserTokens.mockResolvedValue(undefined);

      await refreshTokenService.deleteAllUserTokens(userId);

      expect(mockRefreshTokenModel.deleteAllUserTokens).toHaveBeenCalledWith(
        userId
      );
      expect(mockRefreshTokenModel.deleteAllUserTokens).toHaveBeenCalledTimes(
        1
      );
    });

    it('should handle database error', async () => {
      const dbError = new Error('Database connection failed');
      mockRefreshTokenModel.deleteAllUserTokens.mockRejectedValue(dbError);

      await expect(
        refreshTokenService.deleteAllUserTokens(userId)
      ).rejects.toThrow(DatabaseError);

      await expect(
        refreshTokenService.deleteAllUserTokens(userId)
      ).rejects.toThrow('Failed to delete all user tokens');
    });

    it('should handle non-Error exceptions', async () => {
      mockRefreshTokenModel.deleteAllUserTokens.mockRejectedValue(
        'String error'
      );

      await expect(
        refreshTokenService.deleteAllUserTokens(userId)
      ).rejects.toThrow(DatabaseError);
    });

    it('should handle deletion for user with no tokens', async () => {
      mockRefreshTokenModel.deleteAllUserTokens.mockResolvedValue(undefined);

      await expect(
        refreshTokenService.deleteAllUserTokens('user-with-no-tokens')
      ).resolves.not.toThrow();
    });
  });

  describe('deleteExpiredTokens', () => {
    it('should successfully delete expired RefreshTokens and return count', async () => {
      mockRefreshTokenModel.deleteExpiredTokens.mockResolvedValue(5);

      const result = await refreshTokenService.deleteExpiredTokens();

      expect(result).toBe(5);
      expect(mockRefreshTokenModel.deleteExpiredTokens).toHaveBeenCalledTimes(
        1
      );
      expect(mockRefreshTokenModel.deleteExpiredTokens).toHaveBeenCalledWith();
    });

    it('should return 0 when no expired tokens exist', async () => {
      mockRefreshTokenModel.deleteExpiredTokens.mockResolvedValue(0);

      const result = await refreshTokenService.deleteExpiredTokens();

      expect(result).toBe(0);
    });

    it('should handle database error', async () => {
      const dbError = new Error('Database connection failed');
      mockRefreshTokenModel.deleteExpiredTokens.mockRejectedValue(dbError);

      await expect(refreshTokenService.deleteExpiredTokens()).rejects.toThrow(
        DatabaseError
      );

      await expect(refreshTokenService.deleteExpiredTokens()).rejects.toThrow(
        'Failed to delete expired tokens'
      );
    });

    it('should handle non-Error exceptions', async () => {
      mockRefreshTokenModel.deleteExpiredTokens.mockRejectedValue(
        'String error'
      );

      await expect(refreshTokenService.deleteExpiredTokens()).rejects.toThrow(
        DatabaseError
      );
    });

    it('should handle large deletion counts', async () => {
      mockRefreshTokenModel.deleteExpiredTokens.mockResolvedValue(999999);

      const result = await refreshTokenService.deleteExpiredTokens();

      expect(result).toBe(999999);
    });
  });

  describe('DynamoDB Edge Cases', () => {
    it('should handle extremely long input strings', async () => {
      const longUserId = 'a'.repeat(10000);
      const longTokenId = 'b'.repeat(10000);

      mockRefreshTokenModel.findByUserAndToken.mockResolvedValue(null);

      await refreshTokenService.findByUserAndToken(longUserId, longTokenId);

      expect(mockRefreshTokenModel.findByUserAndToken).toHaveBeenCalledWith(
        longUserId,
        longTokenId
      );
    });

    it('should handle Unicode and special characters', async () => {
      const unicodeUserId = '用户ID_🔑_test';
      const specialTokenId = 'token-with-émojis-🎭';

      mockRefreshTokenModel.findByUserAndToken.mockResolvedValue(null);

      await refreshTokenService.findByUserAndToken(
        unicodeUserId,
        specialTokenId
      );

      expect(mockRefreshTokenModel.findByUserAndToken).toHaveBeenCalledWith(
        unicodeUserId,
        specialTokenId
      );
    });

    it('should handle DynamoDB throttling errors', async () => {
      const throttleError = new Error('ProvisionedThroughputExceededException');
      mockRefreshTokenModel.findByUserAndToken.mockRejectedValue(throttleError);

      await expect(
        refreshTokenService.findByUserAndToken('userId', 'tokenId')
      ).rejects.toThrow(DatabaseError);
    });

    it('should handle DynamoDB item size limit errors', async () => {
      const itemSizeError = new Error(
        'ValidationException: Item size has exceeded 400 KB'
      );
      mockRefreshTokenModel.create.mockRejectedValue(itemSizeError);

      const refreshTokenInput = {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        refreshTokenHash: '550e8400-e29b-41d4-a716-446655440002',
        expiresAt: '2025-01-01T00:00:00.000Z',
        revoked: false,
      };

      await expect(
        refreshTokenService.create(refreshTokenInput)
      ).rejects.toThrow(DatabaseError);
    });
  });
});
