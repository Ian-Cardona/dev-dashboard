import { describe, it, expect, beforeAll } from 'vitest';
import {
  refreshTokenValidation,
  refreshTokenCreateValidation,
} from '../refreshToken.validation';
import { generateUUID } from '../../utils/uuid.utils';

describe('Refresh Token Validation Schemas', () => {
  let validRefreshTokenData;
  let createData;

  beforeAll(() => {
    validRefreshTokenData = {
      userId: generateUUID(),
      refreshTokenId: generateUUID(),
      refreshTokenHash: 'validHashString',
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour in the future
      createdAt: new Date().toISOString(),
      revoked: false,
    };

    createData = {
      userId: validRefreshTokenData.userId,
      expiresAt: validRefreshTokenData.expiresAt,
      // Note: no 'revoked' here; it's omitted in creation schema and defaulted internally
    };
  });

  describe('refreshTokenValidation', () => {
    it('should validate a complete and correct refresh token object', () => {
      const result = refreshTokenValidation.parse(validRefreshTokenData);
      expect(result).toEqual(validRefreshTokenData);
    });

    it('should strip unknown properties from the object', () => {
      const dataWithExtra = {
        ...validRefreshTokenData,
        extra: 'should be removed',
      };
      const result = refreshTokenValidation.parse(dataWithExtra);
      expect(result).not.toHaveProperty('extra');
      expect(result).toEqual(validRefreshTokenData);
    });

    it.each([
      ['userId', { userId: 'not-a-uuid' }, 'Invalid UUID'],
      ['refreshTokenId', { refreshTokenId: 'invalid-uuid' }, 'Invalid UUID'],
      [
        'refreshTokenHash',
        { refreshTokenHash: 123 },
        'Invalid refresh token hash',
      ],
      ['expiresAt', { expiresAt: 'not-a-date' }, 'Invalid ISO datetime'],
      ['createdAt', { createdAt: 'invalid-date' }, 'Invalid ISO datetime'],
      ['revoked', { revoked: 'not-boolean' }, 'Invalid boolean value'],
    ])('should fail when %s is invalid', (field, invalidObj, expectedError) => {
      const testData = { ...validRefreshTokenData, ...invalidObj };
      expect(() => refreshTokenValidation.parse(testData)).toThrow(
        expectedError
      );
    });
  });

  describe('refreshTokenCreateValidation', () => {
    it('should validate a correct creation object', () => {
      const result = refreshTokenCreateValidation.parse(createData);
      expect(result.userId).toEqual(createData.userId);
      expect(result.expiresAt).toEqual(createData.expiresAt);
      // revoked defaults to false internally since omitted from input
      expect(result.revoked).toBe(false);
    });

    it('should default revoked to false when omitted', () => {
      const result = refreshTokenCreateValidation.parse(createData);
      expect(result.revoked).toBe(false);
    });

    it('should fail if userId is missing or invalid', () => {
      expect(() =>
        refreshTokenCreateValidation.parse({ expiresAt: createData.expiresAt })
      ).toThrow('Invalid UUID');
      expect(() =>
        refreshTokenCreateValidation.parse({
          userId: 'invalid-uuid',
          expiresAt: createData.expiresAt,
        })
      ).toThrow('Invalid UUID');
    });

    it('should fail if expiresAt is missing, invalid, or not a future date', () => {
      // Missing expiresAt
      expect(() =>
        refreshTokenCreateValidation.parse({ userId: createData.userId })
      ).toThrow('Invalid ISO datetime');

      // Invalid ISO datetime
      expect(() =>
        refreshTokenCreateValidation.parse({
          userId: createData.userId,
          expiresAt: 'not-a-date',
        })
      ).toThrow('Invalid ISO datetime');

      // Past date (expiresAt not in the future)
      const pastDate = new Date(Date.now() - 1000).toISOString();
      expect(() =>
        refreshTokenCreateValidation.parse({
          userId: createData.userId,
          expiresAt: pastDate,
        })
      ).toThrow('expiresAt must be a future date');
    });

    it('should strip disallowed fields on create', () => {
      const input = {
        ...createData,
        refreshTokenId: generateUUID(),
        createdAt: new Date().toISOString(),
        refreshTokenHash: 'hash-value',
        // revoked purposely omitted — clients should not set this
      };
      const result = refreshTokenCreateValidation.parse(input);
      expect(result).not.toHaveProperty('refreshTokenId');
      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('refreshTokenHash');
      expect(result).toHaveProperty('revoked', false);
    });
  });

  describe('Edge cases', () => {
    it('should fail when parsing empty object', () => {
      expect(() => refreshTokenValidation.parse({})).toThrow();
    });

    it('should fail when parsing null or undefined', () => {
      expect(() => refreshTokenValidation.parse(null)).toThrow();
      expect(() => refreshTokenValidation.parse(undefined)).toThrow();
    });

    it('should strip unknown properties', () => {
      const extendedData = { ...validRefreshTokenData, extraProp: 'ignore' };
      const parsed = refreshTokenValidation.parse(extendedData);
      expect(parsed).not.toHaveProperty('extraProp');
      expect(parsed).toEqual(validRefreshTokenData);
    });
  });
});
