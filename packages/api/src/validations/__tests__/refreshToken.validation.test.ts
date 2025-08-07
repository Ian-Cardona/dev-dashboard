/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from 'vitest';
import { refreshTokenValidation } from '../refreshToken.validation';
import { generateUUID } from '../../utils/uuid.utils';

describe('Refresh Token Validation', () => {
  const validData = {
    userId: generateUUID(),
    tokenId: generateUUID(),
    refreshToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    expiresAt: '2024-12-31T23:59:59.999Z',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  describe('valid cases', () => {
    it('should pass validation with all valid fields', () => {
      expect(() => refreshTokenValidation.parse(validData)).not.toThrow();

      const result = refreshTokenValidation.parse(validData);
      expect(result).toEqual(validData);
    });

    // it('should accept different valid UUIDs', () => {
    //   const testData = {
    //     ...validData,
    //     userId: '123e4567-e89b-12d3-a456-426614174000',
    //     tokenId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    //   };

    //   expect(() => refreshTokenValidation.parse(testData)).not.toThrow();
    // });

    it('should accept different valid JWT tokens', () => {
      const testData = {
        ...validData,
        refreshToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJleGFtcGxlLmNvbSIsInN1YiI6InVzZXIxMjMiLCJhdWQiOiJhcGkuZXhhbXBsZS5jb20iLCJleHAiOjE2ODg4OTIwMDAsImlhdCI6MTY4ODgwNTYwMCwianRpIjoiYWJjZGVmZ2gtMTIzNCIsInNjb3BlIjoicmVhZCB3cml0ZSJ9.example-signature',
      };

      expect(() => refreshTokenValidation.parse(testData)).not.toThrow();
    });

    it('should accept different valid ISO datetime formats', () => {
      const testData = {
        ...validData,
        expiresAt: '2024-06-15T14:30:45.123Z',
        createdAt: '2023-12-01T09:15:30.000Z',
      };

      expect(() => refreshTokenValidation.parse(testData)).not.toThrow();
    });
  });

  describe('invalid cases - userId', () => {
    it('should fail with invalid UUID format', () => {
      const testData = { ...validData, userId: 'invalid-uuid' };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with empty string', () => {
      const testData = { ...validData, userId: '' };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with null', () => {
      const testData = { ...validData, userId: null };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with missing userId', () => {
      const { userId, ...testData } = validData;

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });
  });

  describe('invalid cases - tokenId', () => {
    it('should fail with invalid UUID format', () => {
      const testData = { ...validData, tokenId: 'not-a-uuid' };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with partial UUID', () => {
      const testData = { ...validData, tokenId: '550e8400-e29b-41d4' };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with missing tokenId', () => {
      const { tokenId, ...testData } = validData;

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });
  });

  describe('invalid cases - refreshToken', () => {
    it('should fail with invalid JWT format', () => {
      const testData = { ...validData, refreshToken: 'invalid.jwt.token' };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with incomplete JWT (missing parts)', () => {
      const testData = {
        ...validData,
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with empty string', () => {
      const testData = { ...validData, refreshToken: '' };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with missing refreshToken', () => {
      const { refreshToken, ...testData } = validData;

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });
  });

  describe('invalid cases - expiresAt', () => {
    it('should fail with invalid ISO datetime format', () => {
      const testData = { ...validData, expiresAt: '2024-13-32T25:61:61.999Z' };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with non-ISO date format', () => {
      const testData = { ...validData, expiresAt: '12/31/2024 11:59 PM' };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with missing timezone', () => {
      const testData = { ...validData, expiresAt: '2024-12-31T23:59:59' };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with missing expiresAt', () => {
      const { expiresAt, ...testData } = validData;

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });
  });

  describe('invalid cases - createdAt', () => {
    it('should fail with invalid ISO datetime format', () => {
      const testData = { ...validData, createdAt: 'invalid-date' };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with timestamp number', () => {
      const testData = { ...validData, createdAt: 1704067200000 };

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });

    it('should fail with missing createdAt', () => {
      const { createdAt, ...testData } = validData;

      expect(() => refreshTokenValidation.parse(testData)).toThrow();
    });
  });

  describe('edge cases', () => {
    it('should fail with completely empty object', () => {
      expect(() => refreshTokenValidation.parse({})).toThrow();
    });

    it('should fail with null input', () => {
      expect(() => refreshTokenValidation.parse(null)).toThrow();
    });

    it('should fail with undefined input', () => {
      expect(() => refreshTokenValidation.parse(undefined)).toThrow();
    });

    it('should ignore extra properties', () => {
      const testData = {
        ...validData,
        extraProperty: 'should be ignored',
      };

      const result = refreshTokenValidation.parse(testData);
      expect(result).not.toHaveProperty('extraProperty');
      expect(result).toEqual(validData);
    });
  });

  describe('safeParse method', () => {
    it('should return success for valid data', () => {
      const result = refreshTokenValidation.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should return error for invalid data', () => {
      const invalidData = { ...validData, userId: 'invalid-uuid' };
      const result = refreshTokenValidation.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
