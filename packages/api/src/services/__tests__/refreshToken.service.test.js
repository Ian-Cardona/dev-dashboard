import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { RefreshTokenService } from '../refreshToken.service';
import { DatabaseError, ConflictError } from '../../utils/errors.utils';
const mockRefreshTokenModel = {
  create: vi.fn(),
  findByUserId: vi.fn(),
  deleteToken: vi.fn(),
  deleteAllUserTokens: vi.fn(),
  deleteExpiredTokens: vi.fn(),
};
const refreshTokenService = RefreshTokenService(mockRefreshTokenModel);
describe('RefreshTokenService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  describe('create', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440001';
    it('should create and return new refresh token with correct fields', async () => {
      mockRefreshTokenModel.create.mockImplementation(async t => t);
      const result = await refreshTokenService.create(userId);
      expect(result).toHaveProperty('refreshToken');
      expect(typeof result.refreshToken).toBe('string');
      expect(result.refreshTokenRecord).toMatchObject({
        userId,
        refreshTokenId: expect.stringMatching(/^[0-9a-f\\-]{36}$/),
        createdAt: expect.any(String),
        expiresAt: expect.any(String),
        refreshTokenHash: expect.any(String),
        revoked: false,
      });
      expect(mockRefreshTokenModel.create).toHaveBeenCalledTimes(1);
    });
    it('throws ConflictError if token already exists', async () => {
      mockRefreshTokenModel.create.mockRejectedValue(
        new Error('ConditionalCheckFailedException')
      );
      await expect(refreshTokenService.create(userId)).rejects.toBeInstanceOf(
        ConflictError
      );
    });
    it('throws DatabaseError for other errors', async () => {
      mockRefreshTokenModel.create.mockRejectedValue(new Error('DB failure'));
      await expect(refreshTokenService.create(userId)).rejects.toBeInstanceOf(
        DatabaseError
      );
    });
    it('throws DatabaseError for non-Error rejection', async () => {
      mockRefreshTokenModel.create.mockRejectedValue('string error');
      await expect(refreshTokenService.create(userId)).rejects.toBeInstanceOf(
        DatabaseError
      );
    });
  });
  describe('findByUserAndMatch', () => {
    const userId = 'uid-find-match';
    const plainToken = 'token-plain-content';
    it('returns the matching token (live bcrypt)', async () => {
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(plainToken, salt);
      const testToken = {
        userId,
        refreshTokenId: 'rtid-test',
        refreshTokenHash: hash,
        expiresAt: '2999-12-31T00:00:00.000Z',
        createdAt: '2025-01-01T00:00:00.000Z',
        revoked: false,
      };
      mockRefreshTokenModel.findByUserId.mockResolvedValue([testToken]);
      const result = await refreshTokenService.findByUserAndMatch(
        userId,
        plainToken
      );
      expect(result).toEqual(testToken);
    });
    it('returns null if no tokens found', async () => {
      mockRefreshTokenModel.findByUserId.mockResolvedValue([]);
      const result = await refreshTokenService.findByUserAndMatch(
        userId,
        plainToken
      );
      expect(result).toBeNull();
    });
    it('returns null if no matching token', async () => {
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('other-token', salt);
      const testToken = {
        userId,
        refreshTokenId: 'rtid-test',
        refreshTokenHash: hash,
        expiresAt: '2999-12-31T00:00:00.000Z',
        createdAt: '2025-01-01T00:00:00.000Z',
        revoked: false,
      };
      mockRefreshTokenModel.findByUserId.mockResolvedValue([testToken]);
      const result = await refreshTokenService.findByUserAndMatch(
        userId,
        plainToken
      );
      expect(result).toBeNull();
    });
    it('throws DatabaseError if model rejects', async () => {
      mockRefreshTokenModel.findByUserId.mockRejectedValue(
        new Error('DB fail')
      );
      await expect(
        refreshTokenService.findByUserAndMatch(userId, plainToken)
      ).rejects.toBeInstanceOf(DatabaseError);
    });
    it('throws DatabaseError for non-Error rejection', async () => {
      mockRefreshTokenModel.findByUserId.mockRejectedValue('string error');
      await expect(
        refreshTokenService.findByUserAndMatch(userId, plainToken)
      ).rejects.toBeInstanceOf(DatabaseError);
    });
  });
  describe('deleteToken', () => {
    const userId = 'delete-user-id';
    const refreshTokenId = 'delete-token-id';
    it('calls deleteToken and resolves', async () => {
      mockRefreshTokenModel.deleteToken.mockResolvedValue(undefined);
      await expect(
        refreshTokenService.deleteToken(userId, refreshTokenId)
      ).resolves.toBeUndefined();
    });
    it('throws DatabaseError on model error', async () => {
      mockRefreshTokenModel.deleteToken.mockRejectedValue(
        new Error('DB error')
      );
      await expect(
        refreshTokenService.deleteToken(userId, refreshTokenId)
      ).rejects.toBeInstanceOf(DatabaseError);
    });
    it('throws DatabaseError on non-Error rejection', async () => {
      mockRefreshTokenModel.deleteToken.mockRejectedValue('fail');
      await expect(
        refreshTokenService.deleteToken(userId, refreshTokenId)
      ).rejects.toBeInstanceOf(DatabaseError);
    });
    it('does not throw if deleting non-existent token', async () => {
      mockRefreshTokenModel.deleteToken.mockResolvedValue(undefined);
      await expect(
        refreshTokenService.deleteToken('nouser', 'notoken')
      ).resolves.toBeUndefined();
    });
  });
  describe('deleteAllUserTokens', () => {
    const userId = 'deleteall-user';
    it('calls deleteAllUserTokens and resolves', async () => {
      mockRefreshTokenModel.deleteAllUserTokens.mockResolvedValue(undefined);
      await expect(
        refreshTokenService.deleteAllUserTokens(userId)
      ).resolves.toBeUndefined();
      expect(mockRefreshTokenModel.deleteAllUserTokens).toHaveBeenCalledWith(
        userId
      );
    });
    it('throws DatabaseError on model error', async () => {
      mockRefreshTokenModel.deleteAllUserTokens.mockRejectedValue(
        new Error('DB fail')
      );
      await expect(
        refreshTokenService.deleteAllUserTokens(userId)
      ).rejects.toBeInstanceOf(DatabaseError);
    });
    it('throws DatabaseError on non-Error rejection', async () => {
      mockRefreshTokenModel.deleteAllUserTokens.mockRejectedValue('fail');
      await expect(
        refreshTokenService.deleteAllUserTokens(userId)
      ).rejects.toBeInstanceOf(DatabaseError);
    });
    it('does not throw for user with no tokens', async () => {
      mockRefreshTokenModel.deleteAllUserTokens.mockResolvedValue(undefined);
      await expect(
        refreshTokenService.deleteAllUserTokens('nouser')
      ).resolves.toBeUndefined();
    });
  });
  describe('deleteExpiredTokens', () => {
    it('returns the count returned by model', async () => {
      mockRefreshTokenModel.deleteExpiredTokens.mockResolvedValue(123);
      const res = await refreshTokenService.deleteExpiredTokens();
      expect(res).toBe(123);
    });
    it('returns zero if nothing deleted', async () => {
      mockRefreshTokenModel.deleteExpiredTokens.mockResolvedValue(0);
      const res = await refreshTokenService.deleteExpiredTokens();
      expect(res).toBe(0);
    });
    it('throws DatabaseError on model rejection with Error', async () => {
      mockRefreshTokenModel.deleteExpiredTokens.mockRejectedValue(
        new Error('fail')
      );
      await expect(
        refreshTokenService.deleteExpiredTokens()
      ).rejects.toBeInstanceOf(DatabaseError);
    });
    it('throws DatabaseError on non-Error rejection', async () => {
      mockRefreshTokenModel.deleteExpiredTokens.mockRejectedValue('fail');
      await expect(
        refreshTokenService.deleteExpiredTokens()
      ).rejects.toBeInstanceOf(DatabaseError);
    });
    it('returns high value from model', async () => {
      mockRefreshTokenModel.deleteExpiredTokens.mockResolvedValue(999999);
      const res = await refreshTokenService.deleteExpiredTokens();
      expect(res).toBe(999999);
    });
  });
});
