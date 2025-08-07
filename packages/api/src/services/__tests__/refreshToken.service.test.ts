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
import { DatabaseError } from '../../utils/errors.utils';

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
    const refreshTokenInput: Omit<RefreshToken, 'tokenId' | 'createdAt'> = {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      refreshToken: '550e8400-e29b-41d4-a716-446655440003',
      expiresAt: '2025-01-01T00:00:00.000Z',
    };

    it('should successfully create a new RefreshToken and return it', async () => {
      mockRefreshTokenModel.create.mockImplementation(async tokenToStore => {
        return tokenToStore;
      });

      const result = await refreshTokenService.create(refreshTokenInput);

      expect(result).toMatchObject(refreshTokenInput);
      expect(result.tokenId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(new Date(result.createdAt).toISOString()).toBe(result.createdAt);

      expect(mockRefreshTokenModel.create).toHaveBeenCalledTimes(1);

      expect(mockRefreshTokenModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...refreshTokenInput,
          tokenId: expect.stringMatching(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
          ),
          createdAt: expect.any(String),
        })
      );
    });

    it('should handle refresh token create failure', async () => {
      const error = new DatabaseError('Failed to create refresh token');

      mockRefreshTokenModel.create.mockRejectedValue(error);

      await expect(
        refreshTokenService.create(refreshTokenInput)
      ).rejects.toThrow(error);
      expect(mockRefreshTokenModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...refreshTokenInput,
          tokenId: expect.any(String),
          createdAt: expect.any(String),
        })
      );
      expect(mockRefreshTokenModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByUserAndToken', () => {
    const refreshToken: RefreshToken = {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      tokenId: '550e8400-e29b-41d4-a716-446655440002',
      refreshToken: '550e8400-e29b-41d4-a716-446655440003',
      expiresAt: '2025-01-01T00:00:00.000Z',
      createdAt: '2025-01-01T00:00:00.000Z',
    };

    it('should successfully find a RefreshToken by userId and tokenId', async () => {
      mockRefreshTokenModel.findByUserAndToken.mockResolvedValue(refreshToken);

      const result = await refreshTokenService.findByUserAndToken(
        refreshToken.userId,
        refreshToken.tokenId
      );

      expect(result).toEqual(refreshToken);
      expect(mockRefreshTokenModel.findByUserAndToken).toHaveBeenCalledWith(
        refreshToken.userId,
        refreshToken.tokenId
      );
      expect(mockRefreshTokenModel.findByUserAndToken).toHaveBeenCalledTimes(1);
    });

    it('should handle refresh token find failure', async () => {
      const error = new DatabaseError('Failed to find refresh token');

      mockRefreshTokenModel.findByUserAndToken.mockRejectedValue(error);

      await expect(
        refreshTokenService.findByUserAndToken(
          refreshToken.userId,
          refreshToken.tokenId
        )
      ).rejects.toThrow(error);
      expect(mockRefreshTokenModel.findByUserAndToken).toHaveBeenCalledWith(
        refreshToken.userId,
        refreshToken.tokenId
      );
      expect(mockRefreshTokenModel.findByUserAndToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteToken', () => {
    const refreshToken: RefreshToken = {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      tokenId: '550e8400-e29b-41d4-a716-446655440002',
      refreshToken: '550e8400-e29b-41d4-a716-446655440003',
      expiresAt: '2025-01-01T00:00:00.000Z',
      createdAt: '2025-01-01T00:00:00.000Z',
    };

    it('should successfully delete a RefreshToken', async () => {
      await refreshTokenService.deleteToken(
        refreshToken.userId,
        refreshToken.tokenId
      );

      expect(mockRefreshTokenModel.deleteToken).toHaveBeenCalledWith(
        refreshToken.userId,
        refreshToken.tokenId
      );
      expect(mockRefreshTokenModel.deleteToken).toHaveBeenCalledTimes(1);
    });

    it('should handle refresh token delete failure', async () => {
      const error = new DatabaseError('Failed to delete refresh token');

      mockRefreshTokenModel.deleteToken.mockRejectedValue(error);

      await expect(
        refreshTokenService.deleteToken(
          refreshToken.userId,
          refreshToken.tokenId
        )
      ).rejects.toThrow(error);
      expect(mockRefreshTokenModel.deleteToken).toHaveBeenCalledWith(
        refreshToken.userId,
        refreshToken.tokenId
      );
      expect(mockRefreshTokenModel.deleteToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteAllUserTokens', () => {
    it('should successfully delete all RefreshTokens for a user', async () => {
      await refreshTokenService.deleteAllUserTokens(
        '550e8400-e29b-41d4-a716-446655440001'
      );

      expect(mockRefreshTokenModel.deleteAllUserTokens).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440001'
      );
      expect(mockRefreshTokenModel.deleteAllUserTokens).toHaveBeenCalledTimes(
        1
      );
    });

    it('should handle refresh token delete failure', async () => {
      const error = new DatabaseError('Failed to delete all user tokens');

      mockRefreshTokenModel.deleteAllUserTokens.mockRejectedValue(error);

      await expect(
        refreshTokenService.deleteAllUserTokens(
          '550e8400-e29b-41d4-a716-446655440001'
        )
      ).rejects.toThrow(error);
      expect(mockRefreshTokenModel.deleteAllUserTokens).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440001'
      );
      expect(mockRefreshTokenModel.deleteAllUserTokens).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('deleteExpiredTokens', () => {
    it('should successfully delete expired RefreshTokens', async () => {
      mockRefreshTokenModel.deleteExpiredTokens.mockResolvedValue(5);
      const result = await refreshTokenService.deleteExpiredTokens();
      expect(result).toBe(5);
      expect(mockRefreshTokenModel.deleteExpiredTokens).toHaveBeenCalledTimes(
        1
      );
    });

    it('should handle refresh token delete failure', async () => {
      const error = new DatabaseError('Failed to delete expired tokens');

      mockRefreshTokenModel.deleteExpiredTokens.mockRejectedValue(error);

      await expect(refreshTokenService.deleteExpiredTokens()).rejects.toThrow(
        error
      );
      expect(mockRefreshTokenModel.deleteExpiredTokens).toHaveBeenCalledTimes(
        1
      );
    });
  });
});
