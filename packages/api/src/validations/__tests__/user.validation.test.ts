import { describe, it, expect } from 'vitest';
import { generateUserId } from '../../utils/uuid.utils';
import { VALIDATION_CONSTANTS } from '../../constants/validations';
import {
  userValidation,
  userCreateValidation,
  userUpdateValidation,
} from '../user.validation';

describe('User Validation (Base Schema)', () => {
  it('should successfully validate a complete and correct user object', () => {
    const validUserData = {
      userId: generateUserId(),
      email: 'test@example.com',
      passwordHash:
        '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2025-07-31T14:42:05.000Z',
      updatedAt: '2025-07-31T14:42:05.000Z',
      lastLoginAt: '2025-08-01T10:00:00.000Z',
      isActive: true,
    };
    expect(userValidation.parse(validUserData)).toEqual(validUserData);
  });

  // For each required field, test invalid values.
  it.each([
    ['userId', { userId: 'not-a-uuid' }],
    ['email', { email: 'invalid-email' }],
    ['passwordHash', { passwordHash: 'short' }],
    ['createdAt', { createdAt: 'not-a-date' }],
    ['updatedAt', { updatedAt: 'not-a-date' }],
    ['isActive', { isActive: 'not-a-boolean' }],
  ])('should throw an error for an invalid `%s`', (field, invalidData) => {
    const baseData = {
      userId: generateUserId(),
      email: 'test@example.com',
      passwordHash: 'a'.repeat(
        VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
      ),
      createdAt: '2025-07-31T14:42:05.000Z',
      updatedAt: '2025-07-31T14:42:05.000Z',
      isActive: true,
    };
    const testData = { ...baseData, ...invalidData };
    expect(() => userValidation.parse(testData)).toThrow();
  });

  // For each optional field, test invalid values.
  it.each([
    [
      'firstName',
      'a'.repeat(VALIDATION_CONSTANTS.USER.FIRST_NAME.MAX_LENGTH + 1),
    ],
    [
      'lastName',
      'a'.repeat(VALIDATION_CONSTANTS.USER.LAST_NAME.MAX_LENGTH + 1),
    ],
    ['lastLoginAt', 'not-a-date'],
  ])(
    'should throw an error for an invalid optional field: `%s`',
    (field, value) => {
      const baseData = {
        userId: generateUserId(),
        email: 'test@example.com',
        passwordHash: 'a'.repeat(
          VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
        ),
        createdAt: '2025-07-31T14:42:05.000Z',
        updatedAt: '2025-07-31T14:42:05.000Z',
        isActive: true,
      };
      const testData = { ...baseData, [field]: value };
      expect(() => userValidation.parse(testData)).toThrow();
    }
  );

  describe('Edge Cases', () => {
    const baseData = {
      userId: generateUserId(),
      email: 'test@example.com',
      passwordHash: 'a'.repeat(
        VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
      ),
      createdAt: '2025-07-31T14:42:05.000Z',
      updatedAt: '2025-07-31T14:42:05.000Z',
      isActive: true,
    };

    it('should reject empty strings for required fields', () => {
      expect(() => userValidation.parse({ ...baseData, email: '' })).toThrow();
    });

    it('should reject whitespace-only strings for optional fields due to .trim()', () => {
      const testData = { ...baseData, firstName: '   ', lastName: '\t\n ' };
      expect(() => userValidation.parse(testData)).toThrow();
    });

    it('should strip unknown properties from the object', () => {
      const extraPropData = { ...baseData, extra: 'should-be-removed' };
      const result = userValidation.parse(extraPropData);
      expect(result).not.toHaveProperty('extra');
      expect(result).toEqual(baseData);
    });

    it('should reject passwordHash exceeding max length', () => {
      const testData = {
        ...baseData,
        passwordHash: 'A'.repeat(
          VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MAX_LENGTH + 1
        ),
      };
      expect(() => userValidation.parse(testData)).toThrow();
    });
  });
});

describe('User Create Validation', () => {
  it('should validate a correct creation object with required and optional fields', () => {
    const createData = {
      email: 'newuser@example.com',
      passwordHash: 'h'.repeat(
        VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
      ),
      firstName: 'Jane',
      lastName: 'Doe',
    };
    const result = userCreateValidation.parse(createData);
    expect(result).toEqual(createData);
  });

  it('should reject an empty object because fields are required', () => {
    expect(() => userCreateValidation.parse({})).toThrow();
  });

  it('should strip fields that are not allowed during creation', () => {
    const createDataWithExcluded = {
      email: 'test@example.com',
      passwordHash: 'a'.repeat(
        VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
      ),
      userId: generateUserId(),
      isActive: true,
    };

    const result = userCreateValidation.parse(createDataWithExcluded);
    expect(result).not.toHaveProperty('userId');
    expect(result).not.toHaveProperty('isActive');
    expect(result).toEqual({
      email: 'test@example.com',
      passwordHash: 'a'.repeat(
        VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
      ),
    });
  });
});

describe('User Update Validation', () => {
  it('should successfully validate a partial update object', () => {
    const updateData = {
      firstName: 'John-Updated',
      lastName: 'Doe-Updated',
      email: 'test@example.com',
      passwordHash: 'a'.repeat(
        VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
      ),
    };

    const result = userUpdateValidation.parse(updateData);
    expect(result).toEqual(updateData);
  });

  it('should strip fields that are not allowed during an update', () => {
    const updateDataWithExcluded = {
      firstName: 'Updated',
      userId: generateUserId(),
      createdAt: '2025-01-01T00:00:00.000Z',
    };

    const result = userUpdateValidation.parse(updateDataWithExcluded);
    expect(result).not.toHaveProperty('userId');
    expect(result).not.toHaveProperty('createdAt');
    expect(result).toEqual({ firstName: 'Updated' });
  });

  it('should reject short passwordHash during update', () => {
    const updateData = { passwordHash: 'short' };
    expect(() => userUpdateValidation.parse(updateData)).toThrow();
  });

  it('should throw an error if a provided field is invalid', () => {
    const invalidUpdate = { email: 'not-a-valid-email' };
    expect(() => userUpdateValidation.parse(invalidUpdate)).toThrow();
  });
});
