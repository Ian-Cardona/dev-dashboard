import { describe, it, expect, beforeAll } from 'vitest';
import { z } from 'zod';
import { generateUUID } from '../../utils/uuid.utils';
import {
  refreshTokenSchema,
  refreshTokenCreateSchema,
} from '../../../../shared/schemas/refreshToken.schema';

describe('Refresh Token Validation Schemas', () => {
  let validRefreshTokenData;
  let createData;

  beforeAll(() => {
    const userId = generateUUID();
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    validRefreshTokenData = {
      userId,
      refreshTokenId: generateUUID(),
      refreshTokenHash: 'a_valid_and_secure_hash_string_12345',
      expiresAt,
      createdAt: new Date().toISOString(),
      revoked: false,
    };

    createData = {
      userId,
      expiresAt,
    };
  });

  describe('refreshTokenSchema', () => {
    it('should validate a complete and correct refresh token object', () => {
      const result = refreshTokenSchema.parse(validRefreshTokenData);
      expect(result).toEqual(validRefreshTokenData);
    });

    it('should strip unknown properties from the object', () => {
      const dataWithExtra = {
        ...validRefreshTokenData,
        extra: 'this property should be removed',
      };
      const result = refreshTokenSchema.parse(dataWithExtra);
      // Ensure the extra property is not present after parsing
      expect(result).not.toHaveProperty('extra');
      // The rest of the object should match the original valid data
      expect(result).toEqual(validRefreshTokenData);
    });

    // Use it.each for parameterized testing of invalid fields
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
    ])(
      'should throw an error when %s is invalid',
      (field, invalidObj, expectedError) => {
        const testData = { ...validRefreshTokenData, ...invalidObj };
        // Expect parsing to throw an error containing the specific message
        expect(() => refreshTokenSchema.parse(testData)).toThrow(expectedError);
      }
    );
  });

  // Tests for the refreshTokenCreateSchema
  describe('refreshTokenCreateSchema', () => {
    it('should validate a correct creation object and default revoked to false', () => {
      const result = refreshTokenCreateSchema.parse(createData);
      // Check that the provided fields are correctly parsed
      expect(result.userId).toEqual(createData.userId);
      expect(result.expiresAt).toEqual(createData.expiresAt);
      // Verify that the 'revoked' field defaults to false as specified in the schema
      expect(result.revoked).toBe(false);
    });

    it('should throw an error if userId is missing or invalid', () => {
      // Test case where userId is missing
      expect(() =>
        refreshTokenCreateSchema.parse({ expiresAt: createData.expiresAt })
      ).toThrow('Invalid UUID');

      // Test case where userId is an invalid format
      expect(() =>
        refreshTokenCreateSchema.parse({
          userId: 'invalid-uuid',
          expiresAt: createData.expiresAt,
        })
      ).toThrow('Invalid UUID');
    });

    it('should throw an error if expiresAt is missing, invalid, or not a future date', () => {
      // Test case where expiresAt is missing
      expect(() =>
        refreshTokenCreateSchema.parse({ userId: createData.userId })
      ).toThrow('Invalid ISO datetime');

      // Test case where expiresAt is an invalid format
      expect(() =>
        refreshTokenCreateSchema.parse({
          userId: createData.userId,
          expiresAt: 'not-a-date',
        })
      ).toThrow('Invalid ISO datetime');

      // Test case where expiresAt is a date in the past
      const pastDate = new Date(Date.now() - 1000).toISOString();
      expect(() =>
        refreshTokenCreateSchema.parse({
          userId: createData.userId,
          expiresAt: pastDate,
        })
      ).toThrow('expiresAt must be a future date');
    });

    it('should strip disallowed fields during creation', () => {
      const input = {
        ...createData,
        // These fields should be omitted by the schema
        refreshTokenId: generateUUID(),
        createdAt: new Date().toISOString(),
        refreshTokenHash: 'some-hash-value',
      };
      const result = refreshTokenCreateSchema.parse(input);

      // Verify that the disallowed fields were stripped from the output
      expect(result).not.toHaveProperty('refreshTokenId');
      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('refreshTokenHash');

      // Ensure the default value for 'revoked' is still applied
      expect(result).toHaveProperty('revoked', false);
    });
  });

  // Tests for edge cases
  describe('Edge cases', () => {
    it('should throw an error when parsing an empty object', () => {
      expect(() => refreshTokenSchema.parse({})).toThrow();
    });

    it('should throw an error when parsing null or undefined', () => {
      expect(() => refreshTokenSchema.parse(null)).toThrow();
      expect(() => refreshTokenSchema.parse(undefined)).toThrow();
    });
  });
});
