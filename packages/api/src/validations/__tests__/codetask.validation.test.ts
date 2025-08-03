import { describe, it, expect } from 'vitest';
import { codeTaskValidation } from '../codetask.validation';
import { CodeTaskPriority } from '../../types/codetask.type';
import { generateCodeTaskId, generateUserId } from '../../utils/uuid.utils';

// Valid Data
describe('CodeTask Validation - Valid Data', () => {
  const id = generateCodeTaskId();
  const userId = generateUserId();

  it('should validate valid codetask data (Predefined)', () => {
    const validPredefinedData = {
      id,
      userId,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(codeTaskValidation.parse(validPredefinedData)).toEqual(
      validPredefinedData
    );
  });

  it('should validate valid codetask data (Other)', () => {
    const validOtherData = {
      id,
      userId,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'OTHER',
      customTag: 'TEST_TAG',
    };

    expect(codeTaskValidation.parse(validOtherData)).toEqual(validOtherData);
  });

  it('should handle minimum valid data', () => {
    const boundaryData = {
      id,
      userId,
      content: 'a',
      filePath: 'a',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'OTHER',
      customTag: 'A',
    };

    expect(codeTaskValidation.parse(boundaryData)).toEqual(boundaryData);
  });

  it('should handle maximum valid data', () => {
    const maximumData = {
      id,
      userId,
      content: 'a'.repeat(500),
      filePath: '/Path'.repeat(52),
      lineNumber: 100000,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'OTHER',
      customTag: 'A'.repeat(20),
    };

    expect(codeTaskValidation.parse(maximumData)).toEqual(maximumData);
  });
});

// Invalid Data
describe('CodeTask Validation - Invalid Data', () => {
  const id = generateCodeTaskId();
  const userId = generateUserId();

  it('should throw error for empty userId', () => {
    const invalidData = {
      id,
      userId: '',
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for OTHER type without customTag', () => {
    const invalidData = {
      id,
      userId,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'OTHER',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for empty required fields', () => {
    const boundaryInvalidData = {
      id,
      userId,
      content: '',
      filePath: '',
      lineNumber: 1,
      syncedAt: '',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(boundaryInvalidData)).toThrow();
  });

  it('should throw error for values exceeding maximum limits', () => {
    const boundaryInvalidData = {
      id,
      userId,
      content: 'a'.repeat(501),
      filePath: '/Path'.repeat(261),
      lineNumber: 100001,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(boundaryInvalidData)).toThrow();
  });

  it('should throw error for invalid line number', () => {
    const invalidData = {
      id,
      userId,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 0,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for invalid syncedAt format', () => {
    const invalidData = {
      id,
      userId,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: 'invalid-date',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for invalid type', () => {
    const invalidData = {
      id,
      userId,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'INVALID_TYPE',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for invalid status', () => {
    const invalidData = {
      id,
      userId,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'invalid_status',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });
});

// Missing Fields
describe('CodeTask Validation - Missing Fields', () => {
  const id = generateCodeTaskId();
  const userId = generateUserId();

  it('should throw error for missing required id', () => {
    const invalidData = {
      userId,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for missing required userId', () => {
    const invalidData = {
      id,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for missing required content', () => {
    const invalidData = {
      id,
      userId,
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for missing required filePath', () => {
    const invalidData = {
      id,
      userId,
      content: 'This is a test content. Please ignore.',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for missing required lineNumber', () => {
    const invalidData = {
      id: '1',
      userId: 'TEST_USER12345',
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for missing required syncedAt', () => {
    const invalidData = {
      id: '1',
      userId: 'TEST_USER12345',
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for missing required priority', () => {
    const invalidData = {
      id: '1',
      userId: 'TEST_USER12345',
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for missing required status', () => {
    const invalidData = {
      id: '1',
      userId: 'TEST_USER12345',
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for missing required type', () => {
    const invalidData = {
      id: '1',
      userId: 'TEST_USER12345',
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });
});

// Type Validation
describe('CodeTask Validation - Type Validation', () => {
  const id = generateCodeTaskId();
  const userId = generateUserId();

  it('should throw error for number instead of string fields', () => {
    const invalidData = {
      id,
      userId,
      content: 789,
      filePath: 101,
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for string instead of number lineNumber', () => {
    const invalidData = {
      id,
      userId,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: '1',
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for invalid priority enum', () => {
    const invalidData = {
      id,
      userId,
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: 'INVALID_PRIORITY',
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });
});
