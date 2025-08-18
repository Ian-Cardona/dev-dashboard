import { describe, it, expect } from 'vitest';
import { generateUUID } from '../../utils/uuid.utils';
import { VALIDATION_CONSTANTS } from '../../../../shared/constants/validations';
import {
  codeTaskSchema,
  codeTaskCreateSchema,
  updateCodeTaskSchema,
} from '../../../../shared/schemas/codetask.schema';

describe('CodeTask Schemas', () => {
  const baseData = {
    id: generateUUID(),
    userId: generateUUID(),
    content: 'This is a valid test content snippet.',
    filePath: '/src/components/Test.jsx',
    lineNumber: 42,
    syncedAt: '2025-08-15T21:12:31.000Z',
    priority: 'low', // Correct: lowercase enum
    status: 'todo',
    type: 'TODO',
  };

  const validPredefinedData = { ...baseData };

  const validOtherData = {
    ...baseData,
    type: 'OTHER',
    customTag: 'REFACTOR',
  };

  describe('codeTaskSchema', () => {
    it('should successfully validate a complete predefined code task', () => {
      const result = codeTaskSchema.parse(validPredefinedData);
      expect(result).toEqual(validPredefinedData);
    });

    it('should successfully validate a complete "OTHER" type code task', () => {
      const result = codeTaskSchema.parse(validOtherData);
      expect(result).toEqual(validOtherData);
    });

    it('should strip unknown properties from the object', () => {
      const extraPropData = {
        ...validPredefinedData,
        extra: 'should-be-removed',
      };
      const result = codeTaskSchema.parse(extraPropData);
      expect(result).not.toHaveProperty('extra');
      expect(result).toEqual(validPredefinedData);
    });

    it('should reject "OTHER" type without customTag', () => {
      const testData = { ...validPredefinedData, type: 'OTHER' };
      expect(() => codeTaskSchema.parse(testData)).toThrow();
    });

    it('should reject predefined types with customTag', () => {
      const testData = { ...validPredefinedData, customTag: 'INVALID_TAG' };
      expect(() => codeTaskSchema.parse(testData)).toThrow();
    });

    describe('Invalid Field Values', () => {
      it.each([
        ['id', { id: 'not-a-uuid' }],
        ['userId', { userId: 'not-a-uuid' }],
        ['content', { content: '' }],
        [
          'content',
          {
            content: 'a'.repeat(
              VALIDATION_CONSTANTS.CODETASK.CONTENT.MAX_LENGTH + 1
            ),
          },
        ],
        ['filePath', { filePath: '' }],
        [
          'filePath',
          {
            filePath: 'a'.repeat(
              VALIDATION_CONSTANTS.CODETASK.FILE_PATH.MAX_LENGTH + 1
            ),
          },
        ],
        ['lineNumber', { lineNumber: 0 }],
        ['lineNumber', { lineNumber: '1' }],
        ['syncedAt', { syncedAt: 'invalid-date' }],
        ['priority', { priority: 'invalid_priority' }],
        ['status', { status: 'invalid_status' }],
        ['type', { type: 'INVALID_TYPE' }],
      ])('should throw an error for invalid `%s`', (field, invalidData) => {
        const testData = { ...baseData, ...invalidData };
        expect(() => codeTaskSchema.parse(testData)).toThrow();
      });
    });
  });

  describe('codeTaskCreateSchema', () => {
    const createPayload = {
      userId: generateUUID(),
      content: 'New task for creation',
      filePath: '/test/create/path.js',
      lineNumber: 10,
    };

    it('should validate a correct creation object for a predefined type', () => {
      const data = {
        ...createPayload,
        priority: 'medium',
        status: 'todo',
        type: 'FIXME',
      };
      const result = codeTaskCreateSchema.parse(data);
      expect(result).toEqual(data);
    });

    it('should validate a correct creation object for "OTHER" type', () => {
      const data = {
        ...createPayload,
        priority: 'high',
        status: 'in-progress',
        type: 'OTHER',
        customTag: 'API_INTEGRATION',
      };
      const result = codeTaskCreateSchema.parse(data);
      expect(result).toEqual(data);
    });

    it('should validate a minimal creation object without optional fields', () => {
      const data = { ...createPayload, type: 'TODO' };
      const result = codeTaskCreateSchema.parse(data);
      expect(result).toEqual(data);
    });

    it('should strip fields that are not allowed during creation', () => {
      const createDataWithExcluded = {
        ...createPayload,
        type: 'TODO',
        id: generateUUID(),
        syncedAt: '2025-07-31T14:42:05.000Z',
      };

      const result = codeTaskCreateSchema.parse(createDataWithExcluded);
      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('syncedAt');
      expect(result).toEqual({ ...createPayload, type: 'TODO' });
    });
  });

  describe('updateCodeTaskSchema', () => {
    const validUpdatePayload = {
      content: 'Updated content',
      priority: 'high',
      status: 'in-progress',
      type: 'TODO',
      filePath: '/test/update/path.ts',
      lineNumber: 20,
    };

    it('should successfully validate a complete update object', () => {
      const result = updateCodeTaskSchema.parse(validUpdatePayload);
      expect(result).toEqual(validUpdatePayload);
    });

    it('should validate an "OTHER" type update with customTag', () => {
      const updateData = {
        ...validUpdatePayload,
        type: 'OTHER',
        customTag: 'UPDATED_TAG',
      };
      const result = updateCodeTaskSchema.parse(updateData);
      expect(result).toEqual(updateData);
    });

    it('should strip fields that are not allowed during an update', () => {
      const updateDataWithExcluded = {
        ...validUpdatePayload,
        id: generateUUID(),
        userId: generateUUID(),
        filePath: '/test/update/path.ts',
        lineNumber: 20,
        syncedAt: '2025-08-15T21:12:31.000Z',
      };

      const result = updateCodeTaskSchema.parse(updateDataWithExcluded);
      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('userId');
      expect(result).not.toHaveProperty('syncedAt');
      expect(result).toEqual(validUpdatePayload);
    });

    it('should throw an error if a required field is invalid', () => {
      const invalidUpdate = { ...validUpdatePayload, content: '' };
      expect(() => updateCodeTaskSchema.parse(invalidUpdate)).toThrow();
    });

    it('should reject "OTHER" type update without customTag', () => {
      const updateData = { ...validUpdatePayload, type: 'OTHER' }; // Missing customTag
      expect(() => updateCodeTaskSchema.parse(updateData)).toThrow();
    });

    it('should reject a predefined type update that includes customTag', () => {
      const updateData = {
        ...validUpdatePayload,
        type: 'TODO',
        customTag: 'INVALID',
      };
      expect(() => updateCodeTaskSchema.parse(updateData)).toThrow();
    });
  });
});
