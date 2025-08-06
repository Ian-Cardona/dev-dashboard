import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeTaskService } from '../codetask.service';
import { DatabaseError } from '../../utils/errors.utils';
import { CodeTaskPriority, CodeTask } from '../../types/codetask.type';
import { ICodeTaskModel } from '../../models/codetask.model';
import { MockedFunction } from 'vitest';

const mockCodeTaskModel = {
  create: vi.fn() as MockedFunction<ICodeTaskModel['create']>,
  findByUserId: vi.fn() as MockedFunction<ICodeTaskModel['findByUserId']>,
  update: vi.fn() as MockedFunction<ICodeTaskModel['update']>,
  delete: vi.fn() as MockedFunction<ICodeTaskModel['delete']>,
};

const codeTaskService = CodeTaskService(mockCodeTaskModel);

describe('CodeTask Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('create', () => {
    const createCodeTaskInput = {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      priority: CodeTaskPriority.LOW,
      status: 'todo' as const,
      type: 'TODO' as const,
    };

    it('should successfully create a new CodeTask and return it', async () => {
      const expectedResult: CodeTask = {
        id: expect.any(String),
        userId: '550e8400-e29b-41d4-a716-446655440001',
        content: 'This is a test content. Please ignore.',
        filePath: '/This/Is/A/Test/FilePath',
        lineNumber: 1,
        syncedAt: '2025-01-01T00:00:00.000Z',
        priority: CodeTaskPriority.LOW,
        status: 'todo',
        type: 'TODO',
      };

      mockCodeTaskModel.create.mockResolvedValue(expectedResult);

      const result = await codeTaskService.create(createCodeTaskInput);

      expect(result).toEqual(expectedResult);
      expect(mockCodeTaskModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          syncedAt: '2025-01-01T00:00:00.000Z',
          ...createCodeTaskInput,
        })
      );
      expect(mockCodeTaskModel.create).toHaveBeenCalledTimes(1);
    });

    it('should handle model creation failure', async () => {
      const error = new DatabaseError('Could not create the task.');

      mockCodeTaskModel.create.mockRejectedValue(error);

      await expect(
        codeTaskService.create(createCodeTaskInput)
      ).rejects.toThrow();
      expect(mockCodeTaskModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByUserId', () => {
    it('should successfully find CodeTasks by userId', async () => {
      const userId = '550e8400-e29b-41d4-a716-446655440000';
      const codeTasks: CodeTask[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          userId,
          content: 'This is a test content. Please ignore.',
          filePath: '/This/Is/A/Test/FilePath',
          lineNumber: 1,
          syncedAt: '2025-01-01T00:00:00.000Z',
          priority: CodeTaskPriority.LOW,
          status: 'todo',
          type: 'TODO',
        },
      ];

      mockCodeTaskModel.findByUserId.mockResolvedValue(codeTasks);

      const result = await codeTaskService.findByUserId(userId);

      expect(result).toEqual({
        userId,
        data: codeTasks,
        meta: {
          totalCount: codeTasks.length,
          lastScanAt: '2025-01-01T00:00:00.000Z',
          scannedFiles: 0, // TODO: Add actual scanned files count here
        },
      });
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('should successfully find empty CodeTasks by userId', async () => {
      const userId = '550e8400-e29b-41d4-a716-446655440000';
      const codeTasks: CodeTask[] = [];

      mockCodeTaskModel.findByUserId.mockResolvedValue(codeTasks);

      const result = await codeTaskService.findByUserId(userId);

      expect(result).toEqual({
        userId,
        data: codeTasks,
        meta: {
          totalCount: codeTasks.length,
          lastScanAt: '2025-01-01T00:00:00.000Z',
          scannedFiles: 0,
        },
      });
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('should handle model find failure', async () => {
      const error = new DatabaseError('Could not retrieve tasks');

      mockCodeTaskModel.findByUserId.mockRejectedValue(error);

      await expect(
        codeTaskService.findByUserId('550e8400-e29b-41d4-a716-446655440002')
      ).rejects.toThrow(error);
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440002'
      );
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should successfully update a CodeTask', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440002';
      const userId = '550e8400-e29b-41d4-a716-446655440002';
      const updates: Partial<CodeTask> = {
        content: 'Updated content',
      };

      await codeTaskService.update(id, userId, updates);

      expect(mockCodeTaskModel.update).toHaveBeenCalledWith(
        id,
        userId,
        updates
      );
      expect(mockCodeTaskModel.update).toHaveBeenCalledTimes(1);
    });

    it('should handle model update failure', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440002';
      const userId = '550e8400-e29b-41d4-a716-446655440002';
      const updates: Partial<CodeTask> = {
        content: 'Updated content',
      };

      const error = new DatabaseError('Could not update the task.');

      mockCodeTaskModel.update.mockRejectedValue(error);

      await expect(codeTaskService.update(id, userId, updates)).rejects.toThrow(
        error
      );
      expect(mockCodeTaskModel.update).toHaveBeenCalledWith(
        id,
        userId,
        updates
      );
      expect(mockCodeTaskModel.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should successfully delete a CodeTask', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440002';
      const userId = '550e8400-e29b-41d4-a716-446655440002';

      await codeTaskService.delete(id, userId);

      expect(mockCodeTaskModel.delete).toHaveBeenCalledWith(id, userId);
      expect(mockCodeTaskModel.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle model delete failure', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440002';
      const userId = '550e8400-e29b-41d4-a716-446655440002';

      const error = new DatabaseError('Could not delete the task.');

      mockCodeTaskModel.delete.mockRejectedValue(error);

      await expect(codeTaskService.delete(id, userId)).rejects.toThrow(error);
      expect(mockCodeTaskModel.delete).toHaveBeenCalledWith(id, userId);
      expect(mockCodeTaskModel.delete).toHaveBeenCalledTimes(1);
    });
  });
});
