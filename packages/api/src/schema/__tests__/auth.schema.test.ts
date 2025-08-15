import { describe, it, expect } from 'vitest';
import {
  passwordStrengthValidation,
  loginPasswordSchema,
  authenticationRegisterRequestSchema,
  authenticationLoginRequestSchema,
  authenticationRefreshRequestSchema,
  authenticationSuccessResponseSchema,
  authenticationRefreshResponseSchema,
} from '../auth.schema';
import { generateUUID } from '../../utils/uuid.utils';

const MOCK_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const MOCK_UUID = generateUUID();

describe('Authentication Schemas', () => {
  describe('passwordStrengthValidation', () => {
    const email = 'testuser@example.com';
    const username = 'testuser';

    it('should successfully validate a strong, valid password', () => {
      const strongPassword = 'ValidPassword123!';
      const schema = passwordStrengthValidation(email, username);
      expect(() => schema.parse(strongPassword)).not.toThrow();
    });

    it('should validate correctly when email and username are not provided', () => {
      const strongPassword = 'AnotherValidPass1!';
      const schema = passwordStrengthValidation(); // No args
      expect(() => schema.parse(strongPassword)).not.toThrow();
    });

    describe('Failure Cases', () => {
      it.each([
        ['is too short', 'Pass1!'],
        ['is too long', 'a'.repeat(129)],
        ['is missing an uppercase letter', 'validpassword123!'],
        ['is missing a lowercase letter', 'VALIDPASSWORD123!'],
        ['is missing a number', 'ValidPassword!'],
        ['is missing a special character', 'ValidPassword123'],
        ['contains the email', 'MyP@sswordIs_testuser'],
        ['contains the username', 'MyP@sswordIs_testuser_Again'],
        ['contains 4+ repeating characters', 'ValidPasswoooord1!'],
        ['is too simple (sequential)', 'MyPasswordIs_1234!'],
      ])('should throw an error if the password %s', (reason, password) => {
        const schema = passwordStrengthValidation(email, username);
        expect(() => schema.parse(password)).toThrow();
      });
    });
  });

  describe('loginPasswordSchema', () => {
    it('should successfully validate a standard password', () => {
      expect(() =>
        loginPasswordSchema.parse('User-Password123!')
      ).not.toThrow();
    });

    it('should throw an error for an empty password', () => {
      expect(() => loginPasswordSchema.parse('')).toThrow(
        'Password is required'
      );
    });

    it('should throw an error for a password that is too long', () => {
      expect(() => loginPasswordSchema.parse('a'.repeat(129))).toThrow();
    });

    it('should throw an error for a password with invalid characters', () => {
      expect(() => loginPasswordSchema.parse('password-with-€')).toThrow(
        'Password contains invalid characters'
      );
    });
  });

  describe('authenticationRegisterRequestSchema', () => {
    const validPayload = {
      email: 'new.user@domain.com',
      password: 'A-Very-Strong-Password1!',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should validate a complete and correct registration payload', () => {
      const result = authenticationRegisterRequestSchema.parse(validPayload);
      expect(result).toEqual(validPayload);
    });

    it('should validate a payload with only required fields', () => {
      const minimalPayload = {
        email: 'minimal@domain.com',
        password: 'Another-Strong-P@ss1',
      };
      const result = authenticationRegisterRequestSchema.parse(minimalPayload);
      expect(result).toEqual(minimalPayload);
    });

    it('should throw if the email is invalid', () => {
      const payload = { ...validPayload, email: 'not-an-email' };
      expect(() =>
        authenticationRegisterRequestSchema.parse(payload)
      ).toThrow();
    });

    it('should throw if the password is weak', () => {
      const payload = { ...validPayload, password: 'weak' };
      expect(() =>
        authenticationRegisterRequestSchema.parse(payload)
      ).toThrow();
    });
  });

  describe('authenticationLoginRequestSchema', () => {
    const validPayload = {
      email: 'user@domain.com',
      password: 'User-Password123!',
    };

    it('should validate a correct login payload', () => {
      const result = authenticationLoginRequestSchema.parse(validPayload);
      expect(result).toEqual(validPayload);
    });

    it('should throw if the email is invalid', () => {
      const payload = { ...validPayload, email: 'not-an-email' };
      expect(() => authenticationLoginRequestSchema.parse(payload)).toThrow();
    });

    it('should throw if the password is empty', () => {
      const payload = { ...validPayload, password: '' };
      expect(() => authenticationLoginRequestSchema.parse(payload)).toThrow();
    });
  });

  describe('authenticationRefreshRequestSchema', () => {
    const validPayload = {
      userId: MOCK_UUID,
      refreshToken: MOCK_UUID,
    };

    it('should validate a correct refresh payload', () => {
      const result = authenticationRefreshRequestSchema.parse(validPayload);
      expect(result).toEqual(validPayload);
    });

    it('should throw if userId is not a UUID', () => {
      const payload = { ...validPayload, userId: 'not-a-uuid' };
      expect(() => authenticationRefreshRequestSchema.parse(payload)).toThrow();
    });

    it('should throw if refreshToken is empty', () => {
      const payload = { ...validPayload, refreshToken: '' };
      expect(() => authenticationRefreshRequestSchema.parse(payload)).toThrow();
    });
  });

  describe('Response Schemas', () => {
    it('authenticationSuccessResponseSchema should validate a correct payload', () => {
      const payload = {
        accessToken: MOCK_JWT,
        refreshToken: MOCK_UUID,
        user: {
          userId: MOCK_UUID,
          email: 'user@domain.com',
          isActive: true,
        },
      };
      const result = authenticationSuccessResponseSchema.parse(payload);
      expect(result).toEqual(payload);
    });

    it('authenticationSuccessResponseSchema should throw on invalid accessToken', () => {
      const payload = {
        accessToken: 'not-a-jwt',
        refreshToken: MOCK_UUID,
        user: { userId: MOCK_UUID, email: 'user@domain.com' },
      };
      expect(() =>
        authenticationSuccessResponseSchema.parse(payload)
      ).toThrow();
    });

    it('authenticationRefreshResponseSchema should validate a correct payload', () => {
      const payload = {
        accessToken: MOCK_JWT,
        refreshToken: MOCK_UUID,
      };
      const result = authenticationRefreshResponseSchema.parse(payload);
      expect(result).toEqual(payload);
    });

    it('authenticationRefreshResponseSchema should throw on invalid refreshToken', () => {
      const payload = {
        accessToken: MOCK_JWT,
        refreshToken: 'not-a-uuid',
      };
      expect(() =>
        authenticationRefreshResponseSchema.parse(payload)
      ).toThrow();
    });
  });
});
