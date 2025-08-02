import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeTaskService, DatabaseError } from '../codetask.service';
import { CodeTaskPriority, CodeTask } from '../../types/codetask.type';

const mockCodeTaskModel = {
  create: vi.fn(),
  findByUserId: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const codeTaskService = CodeTaskService(mockCodeTaskModel);

describe('CodeTask Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    const createCodeTask: CodeTask = {
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

    it('should successfully create a new CodeTask and return it', async () => {
      mockCodeTaskModel.create.mockResolvedValue(createCodeTask);

      const result = await codeTaskService.create(createCodeTask);

      expect(result).toEqual(createCodeTask);
      expect(mockCodeTaskModel.create).toHaveBeenCalledWith(createCodeTask);
      expect(mockCodeTaskModel.create).toHaveBeenCalledTimes(1);
    });

    it('should handle model creation failure', async () => {
      const error = new DatabaseError('Could not create the task.');

      mockCodeTaskModel.create.mockRejectedValue(error);

      await expect(codeTaskService.create(createCodeTask)).rejects.toThrow();
      expect(mockCodeTaskModel.create).toHaveBeenCalledWith(createCodeTask);
      expect(mockCodeTaskModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByUserId', () => {
    it('should successfully find CodeTasks by userId', async () => {
      const userId = 'TEST_USER12345';
      const codeTasks: CodeTask[] = [
        {
          id: '1',
          userId,
          content: 'This is a test content. Please ignore.',
          filePath: '/This/Is/A/Test/FilePath',
          lineNumber: 1,
          syncedAt: '2025-07-31T14:42:05.000Z',
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
          lastScanAt: new Date().toISOString(),
          scannedFiles: 0, // TODO: Add actual scanned files count here
        },
      });
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('should successfully find empty CodeTasks by userId', async () => {
      const userId = 'TEST_USER12345';
      const codeTasks: CodeTask[] = [];

      mockCodeTaskModel.findByUserId.mockResolvedValue(codeTasks);

      const result = await codeTaskService.findByUserId(userId);

      expect(result).toEqual({
        userId,
        data: codeTasks,
        meta: {
          totalCount: codeTasks.length,
          lastScanAt: new Date().toISOString(),
          scannedFiles: 0,
        },
      });
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('should handle model find failure', async () => {
      const error = new DatabaseError('Could not retrieve tasks.');

      mockCodeTaskModel.findByUserId.mockRejectedValue(error);

      await expect(
        codeTaskService.findByUserId('TEST_USER12345')
      ).rejects.toThrow(error);
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledWith(
        'TEST_USER12345'
      );
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should successfully update a CodeTask', async () => {
      const id = '1';
      const userId = 'TEST_USER12345';
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
      const id = '1';
      const userId = 'TEST_USER12345';
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
      const id = '1';
      const userId = 'TEST_USER12345';

      await codeTaskService.delete(id, userId);

      expect(mockCodeTaskModel.delete).toHaveBeenCalledWith(id, userId);
      expect(mockCodeTaskModel.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle model delete failure', async () => {
      const id = '1';
      const userId = 'TEST_USER12345';

      const error = new DatabaseError('Could not delete the task.');

      mockCodeTaskModel.delete.mockRejectedValue(error);

      await expect(codeTaskService.delete(id, userId)).rejects.toThrow(error);
      expect(mockCodeTaskModel.delete).toHaveBeenCalledWith(id, userId);
      expect(mockCodeTaskModel.delete).toHaveBeenCalledTimes(1);
    });
  });
});
