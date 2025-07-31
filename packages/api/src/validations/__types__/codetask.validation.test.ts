import { describe, it, expect } from 'vitest';
import { codeTaskValidation } from '../codetask.validation';
import { CodeTaskPriority } from '../../types/codetask.type';

describe('CodeTask Validation', () => {
  it('should validate valid codetask data (Predefined)', () => {
    const validData = {
      id: '1',
      userId: 'TEST_USER12345',
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    expect(() => codeTaskValidation.parse(validData)).not.toThrow();
  });

  it('should validate valid codetask data (Other)', () => {
    const validData = {
      id: '1',
      userId: 'TEST_USER12345',
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'OTHER',
      customTag: 'TEST_TAG',
    };

    expect(() => codeTaskValidation.parse(validData)).not.toThrow();
  });

  it('should throw error for invalid codetask data (Predefined)', () => {
    const invalidData = {
      id: '1',
      userId: 'TEST_USER12345',
      content: 'Test content',
      filePath: 'Test file path',
      lineNumber: 1,
      syncedAt: 'Test synced at',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'INVALID',
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });

  it('should throw error for invalid codetask data (Other)', () => {
    const invalidData = {
      id: '1',
      userId: 'TEST_USER12345',
      content: 'Test content',
      filePath: 'Test file path',
      lineNumber: 1,
      syncedAt: 'Test synced at',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'OTHER',
      customTag: undefined,
    };

    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });
});

describe('CodeTask Validation - Edge Cases', () => {
  it('should handle minimum values', () => {
    const boundaryData = {
      id: 'a',
      userId: 'a',
      content: 'a',
      filePath: 'Path',
      lineNumber: 1,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };
    expect(() => codeTaskValidation.parse(boundaryData)).not.toThrow();
  });

  it('should handle maximum valid data', () => {
    const maximumData = {
      id: 'a'.repeat(50),
      userId: 'a'.repeat(50),
      content: 'a'.repeat(500),
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 100000,
      syncedAt: '2025-07-31T14:42:05.000Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };
    expect(() => codeTaskValidation.parse(maximumData)).not.toThrow();
  });

  it('should handle invalid values', () => {
    const invalidData = {
      id: 'a'.repeat(51),
      userId: 'a'.repeat(51),
      content: 'a'.repeat(501),
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 100001,
      // TODO: Invalid syncedAt
      syncedAt: '2025-07-31T14:42:05Z',
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };
    expect(() => codeTaskValidation.parse(invalidData)).toThrow();
  });
});
