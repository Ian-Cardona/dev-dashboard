import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { CodeTaskService } from '../codetask.service';
import { DatabaseError, NotFoundError } from '../../utils/errors.utils';
import {
  ConditionalCheckFailedException,
  DynamoDBServiceException,
} from '@aws-sdk/client-dynamodb';
const mockCodeTaskModel = {
  create: vi.fn(),
  findByUserId: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};
const codeTaskService = CodeTaskService(mockCodeTaskModel);
describe('CodeTaskService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  describe('create', () => {
    const input = {
      userId: 'user-123',
      content: 'Test content',
      filePath: '/path/to/file',
      lineNumber: 1,
      priority: 'low',
      status: 'todo',
      type: 'TODO',
    };
    it('should create and return a CodeTask with generated fields', async () => {
      const createdTask = {
        ...input,
        id: 'generated-uuid',
        syncedAt: new Date().toISOString(),
        priority: input.priority,
        status: input.status,
      };
      mockCodeTaskModel.create.mockResolvedValue(createdTask);
      const result = await codeTaskService.create(input);
      expect(result).toEqual(createdTask);
      expect(mockCodeTaskModel.create).toHaveBeenCalledTimes(1);
      expect(mockCodeTaskModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          syncedAt: expect.any(String),
          ...input,
        })
      );
    });
    it('should throw DatabaseError if model.create rejects', async () => {
      const error = new Error('DB failure');
      mockCodeTaskModel.create.mockRejectedValue(error);
      await expect(codeTaskService.create(input)).rejects.toBeInstanceOf(
        DatabaseError
      );
      expect(mockCodeTaskModel.create).toHaveBeenCalledTimes(1);
    });
  });
  describe('findByUserId', () => {
    const userId = 'user-123';
    it('should return CodeTasksInfo with data and meta', async () => {
      const tasks = [
        {
          id: 'task-1',
          userId,
          content: 'content',
          filePath: '/file/path',
          lineNumber: 1,
          syncedAt: new Date().toISOString(),
          priority: 'low',
          status: 'todo',
          type: 'TODO',
        },
      ];
      mockCodeTaskModel.findByUserId.mockResolvedValue(tasks);
      const result = await codeTaskService.findByUserId(userId);
      expect(result).toEqual({
        userId,
        data: tasks,
        meta: {
          totalCount: tasks.length,
          lastScanAt: expect.any(String),
          scannedFiles: 0,
        },
      });
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockCodeTaskModel.findByUserId).toHaveBeenCalledTimes(1);
    });
    it('should return empty data array if no tasks found', async () => {
      mockCodeTaskModel.findByUserId.mockResolvedValue([]);
      const result = await codeTaskService.findByUserId(userId);
      expect(result.data).toEqual([]);
      expect(result.meta.totalCount).toBe(0);
    });
    it('should throw DatabaseError if model.findByUserId rejects', async () => {
      const error = new Error('DB failure');
      mockCodeTaskModel.findByUserId.mockRejectedValue(error);
      await expect(codeTaskService.findByUserId(userId)).rejects.toBeInstanceOf(
        DatabaseError
      );
    });
  });
  describe('update', () => {
    const taskId = 'task-123';
    const userId = 'user-123';
    const updates = { content: 'Updated content' };
    it('should call model.update with correct params', async () => {
      mockCodeTaskModel.update.mockResolvedValue();
      await codeTaskService.update(taskId, userId, updates);
      expect(mockCodeTaskModel.update).toHaveBeenCalledWith(
        taskId,
        userId,
        updates
      );
      expect(mockCodeTaskModel.update).toHaveBeenCalledTimes(1);
    });
    it('should throw NotFoundError when ConditionalCheckFailedException occurs', async () => {
      mockCodeTaskModel.update.mockRejectedValue(
        new ConditionalCheckFailedException({})
      );
      await expect(
        codeTaskService.update(taskId, userId, updates)
      ).rejects.toBeInstanceOf(NotFoundError);
    });
    it('should throw DatabaseError on DynamoDBServiceException', async () => {
      mockCodeTaskModel.update.mockRejectedValue(
        new DynamoDBServiceException({ message: 'fail' })
      );
      await expect(
        codeTaskService.update(taskId, userId, updates)
      ).rejects.toBeInstanceOf(DatabaseError);
    });
    it('should throw DatabaseError on generic error', async () => {
      mockCodeTaskModel.update.mockRejectedValue(new Error('fail'));
      await expect(
        codeTaskService.update(taskId, userId, updates)
      ).rejects.toBeInstanceOf(DatabaseError);
    });
  });
  describe('delete', () => {
    const taskId = 'task-123';
    const userId = 'user-123';
    it('should call model.delete correctly', async () => {
      mockCodeTaskModel.delete.mockResolvedValue();
      await codeTaskService.delete(taskId, userId);
      expect(mockCodeTaskModel.delete).toHaveBeenCalledWith(taskId, userId);
      expect(mockCodeTaskModel.delete).toHaveBeenCalledTimes(1);
    });
    it('should throw NotFoundError when ConditionalCheckFailedException occurs', async () => {
      mockCodeTaskModel.delete.mockRejectedValue(
        new ConditionalCheckFailedException({})
      );
      await expect(
        codeTaskService.delete(taskId, userId)
      ).rejects.toBeInstanceOf(NotFoundError);
    });
    it('should throw DatabaseError on generic error', async () => {
      mockCodeTaskModel.delete.mockRejectedValue(new Error('fail'));
      await expect(
        codeTaskService.delete(taskId, userId)
      ).rejects.toBeInstanceOf(DatabaseError);
    });
  });
});
