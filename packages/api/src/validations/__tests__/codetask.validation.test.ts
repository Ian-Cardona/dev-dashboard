import { describe, it, expect } from 'vitest';
import { generateUUID } from '../../utils/uuid.utils';
import { CodeTaskPriority } from '../../types/codetask.type';
import { VALIDATION_CONSTANTS } from '../../constants/validations';
import {
  codeTaskValidation,
  codeTaskCreateValidation,
  codeTaskUpdateValidation,
} from '../codetask.validation';

describe('CodeTask Validation', () => {
  const validPredefinedData = {
    id: generateUUID(),
    userId: generateUUID(),
    content: 'This is a test content. Please ignore.',
    filePath: '/This/Is/A/Test/FilePath',
    lineNumber: 1,
    syncedAt: '2025-07-31T14:42:05.000Z',
    priority: CodeTaskPriority.LOW,
    status: 'todo',
    type: 'TODO',
  };

  const validOtherData = {
    id: generateUUID(),
    userId: generateUUID(),
    content: 'This is a test content. Please ignore.',
    filePath: '/This/Is/A/Test/FilePath',
    lineNumber: 1,
    syncedAt: '2025-07-31T14:42:05.000Z',
    priority: CodeTaskPriority.LOW,
    status: 'todo',
    type: 'OTHER',
    customTag: 'TEST_TAG',
  };

  const baseData = {
    id: generateUUID(),
    userId: generateUUID(),
    content: 'Test content',
    filePath: '/test/path',
    lineNumber: 1,
    syncedAt: '2025-07-31T14:42:05.000Z',
    priority: CodeTaskPriority.LOW,
    status: 'todo',
    type: 'TODO',
  };

  describe('Base Schema', () => {
    it('should successfully validate a complete predefined code task', () => {
      expect(codeTaskValidation.parse(validPredefinedData)).toEqual(
        validPredefinedData
      );
    });

    it('should successfully validate a complete OTHER type code task', () => {
      expect(codeTaskValidation.parse(validOtherData)).toEqual(validOtherData);
    });

    // Test invalid values for required fields
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
      [
        'lineNumber',
        { lineNumber: VALIDATION_CONSTANTS.CODETASK.LINE_NUMBER.MAX + 1 },
      ],
      ['lineNumber', { lineNumber: '1' }],
      ['syncedAt', { syncedAt: 'invalid-date' }],
      ['priority', { priority: 'INVALID_PRIORITY' }],
      ['status', { status: 'invalid_status' }],
      ['type', { type: 'INVALID_TYPE' }],
    ])('should throw an error for invalid `%s`', (field, invalidData) => {
      const testData = { ...baseData, ...invalidData };
      expect(() => codeTaskValidation.parse(testData)).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should reject OTHER type without customTag', () => {
      const testData = { ...baseData, type: 'OTHER' };
      expect(() => codeTaskValidation.parse(testData)).toThrow();
    });

    it('should reject predefined types with customTag', () => {
      const testData = {
        ...baseData,
        type: 'TODO',
        customTag: 'SHOULD_NOT_BE_HERE',
      };
      expect(() => codeTaskValidation.parse(testData)).toThrow();
    });

    it('should validate boundary values correctly', () => {
      const boundaryData = {
        ...baseData,
        content: 'a'.repeat(VALIDATION_CONSTANTS.CODETASK.CONTENT.MIN_LENGTH),
        lineNumber: VALIDATION_CONSTANTS.CODETASK.LINE_NUMBER.MIN,
        type: 'OTHER',
        customTag: 'A'.repeat(
          VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.MIN_LENGTH
        ),
      };
      expect(codeTaskValidation.parse(boundaryData)).toEqual(boundaryData);
    });

    it('should reject customTag exceeding max length', () => {
      const testData = {
        ...baseData,
        type: 'OTHER',
        customTag: 'A'.repeat(
          VALIDATION_CONSTANTS.CODETASK.CUSTOM_TAG.MAX_LENGTH + 1
        ),
      };
      expect(() => codeTaskValidation.parse(testData)).toThrow();
    });

    it('should strip unknown properties from the object', () => {
      const extraPropData = { ...baseData, extra: 'should-be-removed' };
      const result = codeTaskValidation.parse(extraPropData);
      expect(result).not.toHaveProperty('extra');
      expect(result).toEqual(baseData);
    });
  });
});

describe('CodeTask Create Validation', () => {
  it('should validate a correct creation object for predefined type', () => {
    const createData = {
      userId: generateUUID(),
      content: 'Test content for creation',
      filePath: '/test/create/path',
      lineNumber: 5,
      priority: CodeTaskPriority.MEDIUM,
      status: 'todo',
      type: 'FIXME',
    };
    const result = codeTaskCreateValidation.parse(createData);
    expect(result).toEqual(createData);
  });

  it('should validate a correct creation object for OTHER type', () => {
    const createData = {
      userId: generateUUID(),
      content: 'Test content for creation',
      filePath: '/test/create/path',
      lineNumber: 5,
      priority: CodeTaskPriority.MEDIUM,
      status: 'todo',
      type: 'OTHER',
      customTag: 'CUSTOM_TEST',
    };
    const result = codeTaskCreateValidation.parse(createData);
    expect(result).toEqual(createData);
  });

  it('should strip fields that are not allowed during creation', () => {
    const createDataWithExcluded = {
      userId: generateUUID(),
      content: 'Test content',
      filePath: '/test/path',
      lineNumber: 1,
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
      id: generateUUID(),
      syncedAt: '2025-07-31T14:42:05.000Z',
    };

    const result = codeTaskCreateValidation.parse(createDataWithExcluded);
    expect(result).not.toHaveProperty('id');
    expect(result).not.toHaveProperty('syncedAt');
  });
});

describe('CodeTask Update Validation', () => {
  it('should successfully validate a partial update object', () => {
    const updateData = {
      content: 'Updated content',
      priority: CodeTaskPriority.HIGH,
      status: 'in-progress',
      type: 'TODO',
    };

    const result = codeTaskUpdateValidation.parse(updateData);
    expect(result).toEqual(updateData);
  });

  it('should validate OTHER type update with customTag', () => {
    const updateData = {
      content: 'Updated content',
      priority: CodeTaskPriority.HIGH,
      status: 'in-progress',
      type: 'OTHER',
      customTag: 'UPDATED_TAG',
    };

    const result = codeTaskUpdateValidation.parse(updateData);
    expect(result).toEqual(updateData);
  });

  it('should strip fields that are not allowed during update', () => {
    const updateDataWithExcluded = {
      content: 'Updated content',
      priority: CodeTaskPriority.HIGH,
      status: 'in-progress',
      type: 'TODO',
      id: generateUUID(),
      userId: generateUUID(),
      filePath: '/should/be/removed',
      lineNumber: 999,
      syncedAt: '2025-07-31T14:42:05.000Z',
    };

    const result = codeTaskUpdateValidation.parse(updateDataWithExcluded);
    expect(result).not.toHaveProperty('id');
    expect(result).not.toHaveProperty('userId');
    expect(result).not.toHaveProperty('filePath');
    expect(result).not.toHaveProperty('lineNumber');
    expect(result).not.toHaveProperty('syncedAt');
    expect(result).toEqual({
      content: 'Updated content',
      type: 'TODO',
      priority: CodeTaskPriority.HIGH,
      status: 'in-progress',
    });
  });

  it('should throw an error if a provided field is invalid', () => {
    const invalidUpdate = { content: '' };
    expect(() => codeTaskUpdateValidation.parse(invalidUpdate)).toThrow();
  });

  it('should reject OTHER type update without customTag', () => {
    const updateData = { type: 'OTHER' };
    expect(() => codeTaskUpdateValidation.parse(updateData)).toThrow();
  });

  it('should reject predefined type update with customTag', () => {
    const updateData = { type: 'TODO', customTag: 'INVALID' };
    expect(() => codeTaskUpdateValidation.parse(updateData)).toThrow();
  });
});
