import { describe, it, expect, beforeAll } from 'vitest';
import { generateUUID } from '../../utils/uuid.utils';
import { VALIDATION_CONSTANTS } from '../../constants/validations';
import {
  userValidation,
  userCreateValidation,
  userUpdateValidation,
  responseUserValidation,
} from '../user.schema';

describe('User Validation Schemas', () => {
  let validUserData;
  let baseData;

  beforeAll(() => {
    validUserData = {
      userId: generateUUID(),
      email: 'test@example.com',
      passwordHash:
        '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2025-07-31T14:42:05.123Z',
      updatedAt: '2025-07-31T14:42:05.123Z',
      lastLoginAt: '2025-08-01T10:00:00.000Z',
      passwordUpdatedAt: '2025-08-01T10:00:00.000Z',
      isActive: true,
      emailVerified: true,
    };

    baseData = {
      userId: validUserData.userId,
      email: 'minimal@example.com',
      passwordHash: 'a'.repeat(
        VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
      ),
      createdAt: '2025-07-31T14:42:05.456Z',
      updatedAt: '2025-07-31T14:42:05.456Z',
      passwordUpdatedAt: '2025-07-31T14:42:05.456Z',
      isActive: true,
      emailVerified: true,
    };
  });

  describe('Base Schema: userValidation', () => {
    it('should successfully validate a complete and correct user object', () => {
      const result = userValidation.parse(validUserData);
      expect(result).toEqual(validUserData);
    });

    it('should strip unknown properties from the object by default', () => {
      const extraPropData = { ...validUserData, extra: 'should-be-removed' };
      const result = userValidation.parse(extraPropData);
      expect(result).not.toHaveProperty('extra');
      expect(result).toEqual(validUserData);
    });

    it.each([
      ['userId', { userId: 'not-a-uuid' }, 'Invalid UUID'],
      ['email', { email: 'invalid-email' }, 'Invalid email address'],
      ['createdAt', { createdAt: 'not-a-date' }, 'Invalid ISO datetime'],
      ['isActive', { isActive: 'not-a-boolean' }, 'Invalid boolean'],
    ])(
      'should fail for an invalid required field: %s',
      (field, invalidData, expectedError) => {
        const testData = { ...baseData, ...invalidData };
        expect(() => userValidation.parse(testData)).toThrow(expectedError);
      }
    );

    it.each([
      [
        'firstName',
        'a'.repeat(VALIDATION_CONSTANTS.USER.FIRST_NAME.MAX_LENGTH + 1),
      ],
      ['lastLoginAt', 'not-a-date'],
      ['passwordUpdatedAt', 'not-a-date'],
    ])('should fail for an invalid optional field: %s', (field, value) => {
      const testData = { ...validUserData, [field]: value };
      expect(() => userValidation.parse(testData)).toThrow();
    });
  });

  describe('Create Schema: userCreateValidation', () => {
    it('should validate a correct creation object', () => {
      const createData = {
        email: 'newuser@example.com',
        passwordHash: 'h'.repeat(
          VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
        ),
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = userCreateValidation.parse(createData);

      expect(result).toEqual(createData);
    });

    it('should fail if missing required fields (email, passwordHash)', () => {
      expect(() => userCreateValidation.parse({ firstName: 'Only' })).toThrow();
    });

    it('should strip fields not allowed during creation', () => {
      const createData = {
        email: 'test@example.com',
        passwordHash: 'a'.repeat(
          VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
        ),
        userId: generateUUID(),
        isActive: true,
      };
      const result = userCreateValidation.parse(createData);
      expect(result).not.toHaveProperty('userId');
      expect(result).not.toHaveProperty('isActive');
    });
  });

  describe('Update Schema: userUpdateValidation', () => {
    it('should validate a partial update with valid data', () => {
      const result = userUpdateValidation.parse({
        firstName: 'John-Updated',
        email: 'test@example.com',
        passwordHash: 'a'.repeat(
          VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
        ),
        passwordUpdatedAt: '2025-08-01T10:00:00.000Z',
      });
      expect(result).toEqual({
        firstName: 'John-Updated',
        email: 'test@example.com',
        passwordHash: 'a'.repeat(
          VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
        ),
        passwordUpdatedAt: '2025-08-01T10:00:00.000Z',
      });
    });

    it('should validate an empty object (no fields updated)', () => {
      expect(() => userUpdateValidation.parse({})).toThrow();
    });

    it('should strip fields not allowed during an update', () => {
      const updateData = {
        firstName: 'Updated',
        userId: generateUUID(),
      };
      expect(() => userUpdateValidation.parse(updateData)).toThrow();
    });

    it('should fail if a provided field is invalid', () => {
      expect(() =>
        userUpdateValidation.parse({
          email: 'not-a-valid-email',
          passwordHash: 'a'.repeat(
            VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
          ),
          passwordUpdatedAt: 'not-a-date',
        })
      ).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should fail if a provided field is invalid', () => {
      expect(() =>
        userUpdateValidation.parse({
          email: 'not-a-valid-email',
          passwordHash: 'a'.repeat(
            VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
          ),
          passwordUpdatedAt: 'not-a-date',
        })
      ).toThrow();
    });
  });

  describe('Response Schema: responseUserValidation', () => {
    it('should strip sensitive fields from the user object', () => {
      const result = responseUserValidation.parse(validUserData);
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('passwordUpdatedAt');
      expect(result).toHaveProperty('email', validUserData.email);
    });
  });
});
