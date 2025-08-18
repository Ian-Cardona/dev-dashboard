import { describe, it, expect, beforeAll } from 'vitest';
import { z } from 'zod';
import { generateUUID } from '../../utils/uuid.utils';
import { VALIDATION_CONSTANTS } from '../../../../shared/constants/validations';
import {
  userSchema,
  userCreateSchema,
  userPartialUpdateSchema,
  responseUserSchema,
} from '../../../../shared/schemas/user.schema';

describe('User Validation Schemas', () => {
  let validUserData;

  beforeAll(() => {
    validUserData = {
      userId: generateUUID(),
      email: 'test@example.com',
      passwordHash:
        '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      passwordUpdatedAt: new Date().toISOString(),
      isActive: true,
    };
  });

  describe('userSchema', () => {
    it('should successfully validate a complete and correct user object', () => {
      const result = userSchema.parse(validUserData);
      expect(result).toEqual(validUserData);
    });

    it('should strip unknown properties from the object by default', () => {
      const extraPropData = { ...validUserData, extra: 'should-be-removed' };
      const result = userSchema.parse(extraPropData);
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
        const testData = { ...validUserData, ...invalidData };
        expect(() => userSchema.parse(testData)).toThrow(expectedError);
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
      expect(() => userSchema.parse(testData)).toThrow();
    });
  });

  describe('userCreateSchema', () => {
    it('should validate a correct creation object', () => {
      const createData = {
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe',
      };
      const result = userCreateSchema.parse(createData);
      expect(result).toEqual(createData);
    });

    it('should fail if missing required fields (email, password)', () => {
      expect(() =>
        userCreateSchema.parse({ email: 'test@test.com' })
      ).toThrow();
      expect(() =>
        userCreateSchema.parse({ password: 'Password123!' })
      ).toThrow();
    });

    it('should strip fields not allowed during creation', () => {
      const createData = {
        email: 'test@example.com',
        password: 'Password123!',
        userId: generateUUID(),
        isActive: false,
        role: 'admin',
      };
      const result = userCreateSchema.parse(createData);
      expect(result).not.toHaveProperty('userId');
      expect(result).not.toHaveProperty('isActive');
      expect(result).not.toHaveProperty('role');
      expect(result).toHaveProperty('email', createData.email);
    });
  });

  describe('userPartialUpdateSchema', () => {
    it('should validate a partial update with valid data', () => {
      const updateData = {
        firstName: 'John-Updated',
        lastName: 'Smith',
      };
      const result = userPartialUpdateSchema.parse(updateData);
      expect(result).toEqual(updateData);
    });

    it('should successfully parse an empty object (no fields updated)', () => {
      const result = userPartialUpdateSchema.parse({});
      expect(result).toEqual({});
    });

    it('should strip fields not allowed during an update', () => {
      const updateData = {
        firstName: 'Updated',
        // These fields are omitted in the schema and should be stripped
        userId: generateUUID(),
        createdAt: new Date().toISOString(),
        role: 'admin',
      };
      const result = userPartialUpdateSchema.parse(updateData);
      expect(result).not.toHaveProperty('userId');
      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('role');
      expect(result).toHaveProperty('firstName', 'Updated');
    });

    it('should fail if a provided field is invalid', () => {
      const invalidUpdate = {
        email: 'not-a-valid-email',
      };
      expect(() => userPartialUpdateSchema.parse(invalidUpdate)).toThrow(
        'Invalid email'
      );
    });
  });

  describe('responseUserSchema', () => {
    it('should strip sensitive and unnecessary fields from the user object', () => {
      const result = responseUserSchema.parse(validUserData);
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('passwordUpdatedAt');

      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('updatedAt');
      expect(result).not.toHaveProperty('lastLoginAt');
      expect(result).not.toHaveProperty('role');

      expect(result).toHaveProperty('userId', validUserData.userId);
      expect(result).toHaveProperty('email', validUserData.email);
    });
  });

  describe('Edge Cases', () => {
    it('should fail when parsing null or undefined with userSchema', () => {
      expect(() => userSchema.parse(null)).toThrow();
      expect(() => userSchema.parse(undefined)).toThrow();
    });

    it('should fail when parsing an empty object with userSchema (as required fields are missing)', () => {
      expect(() => userSchema.parse({})).toThrow();
    });
  });
});
