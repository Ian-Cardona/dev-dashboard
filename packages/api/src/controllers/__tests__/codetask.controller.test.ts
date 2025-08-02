import express from 'express';
import request from 'supertest';
import { describe, it, vi, beforeEach, expect, MockedFunction } from 'vitest';
import { CodeTaskController } from '../codetask.controller';
import { errorHandlerMiddleware } from '../../middlewares/error_handler.middleware';
import {
  DatabaseError,
  ICodeTaskService,
  NotFoundError,
} from '../../services/codetask.service';
import {
  CodeTask,
  CodeTaskPriority,
  CodeTasksInfo,
} from '../../types/codetask.type';
import { codeTaskUpdateValidation } from '../../validations/codetask.validation';

const mockCodeTaskService = {
  create: vi.fn() as MockedFunction<ICodeTaskService['create']>,
  findByUserId: vi.fn() as MockedFunction<ICodeTaskService['findByUserId']>,
  update: vi.fn() as MockedFunction<ICodeTaskService['update']>,
  delete: vi.fn() as MockedFunction<ICodeTaskService['delete']>,
};

const codeTaskControllerInstance = CodeTaskController(mockCodeTaskService);

const app = express();
app.use(express.json());

app.post('/codetasks', codeTaskControllerInstance.createCodeTask);
app.get(
  '/codetasks/:userId',
  codeTaskControllerInstance.findCodeTasksInfoByUserId
);
app.put('/codetasks/:id/:userId', codeTaskControllerInstance.updateCodeTask);
app.delete('/codetasks/:id/:userId', codeTaskControllerInstance.deleteCodeTask);

app.use(errorHandlerMiddleware);

describe('CodeTask Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /codetasks', () => {
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

    it('should create a new CodeTask and return 201', async () => {
      const mockResponse: CodeTask = {
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
      mockCodeTaskService.create.mockResolvedValue(mockResponse);

      await request(app)
        .post('/codetasks')
        .send(validData)
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toEqual(mockResponse);
        });

      expect(mockCodeTaskService.create).toHaveBeenCalledWith(validData);
      expect(mockCodeTaskService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error for invalid data and return 400', async () => {
      const invalidData = {
        id: '1',
        userId: 'TEST_USER12345',
        content: 'This is a test content. Please ignore.',
        filePath: '/This/Is/A/Test/FilePath',
        lineNumber: 0, // Invalid value
        syncedAt: '2025-07-31T14:42:05.000Z',
        priority: CodeTaskPriority.LOW,
        status: 'todo',
        type: 'TODO',
      };

      await request(app).post('/codetasks').send(invalidData).expect(400);

      expect(mockCodeTaskService.create).not.toHaveBeenCalled();
      expect(mockCodeTaskService.create).toHaveBeenCalledTimes(0);
    });

    it('should throw error for a missing required field and return 400', async () => {
      const invalidData = {
        id: '1',
        // Missing userId
        content: 'This is a test content. Please ignore.',
        filePath: '/This/Is/A/Test/FilePath',
        lineNumber: 1,
        syncedAt: '2025-07-31T14:42:05.000Z',
        priority: CodeTaskPriority.LOW,
        status: 'todo',
        type: 'TODO',
      };

      await request(app).post('/codetasks').send(invalidData).expect(400);

      expect(mockCodeTaskService.create).not.toHaveBeenCalled();
      expect(mockCodeTaskService.create).toHaveBeenCalledTimes(0);
    });

    it('should handle service errors and return 500', async () => {
      const error = new DatabaseError('DynamoDB error');
      mockCodeTaskService.create.mockRejectedValue(error);

      await request(app).post('/codetasks').send(validData).expect(500);

      expect(mockCodeTaskService.create).toHaveBeenCalledWith(validData);
      expect(mockCodeTaskService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /codetasks/:userId', () => {
    const userId = 'TEST_USER12345';

    it('should find CodeTasks by userId and return 200', async () => {
      const mockResponse: CodeTasksInfo = {
        userId,
        data: [],
        meta: {
          totalCount: 0,
          lastScanAt: '2025-01-01T00:00:00.000Z',
          scannedFiles: 0,
        },
      };

      mockCodeTaskService.findByUserId.mockResolvedValue(mockResponse);

      await request(app)
        .get(`/codetasks/${userId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toEqual(mockResponse);
        });

      expect(mockCodeTaskService.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockCodeTaskService.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('should return empty array for users with no tasks and return 200', async () => {
      mockCodeTaskService.findByUserId.mockResolvedValue({
        userId,
        data: [],
        meta: {
          totalCount: 0,
          lastScanAt: '2025-01-01T00:00:00.000Z',
          scannedFiles: 0,
        },
      });

      await request(app).get(`/codetasks/${userId}`).expect(200);

      expect(mockCodeTaskService.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockCodeTaskService.findByUserId).toHaveBeenCalledTimes(1);
    });

    it('should handle user not found and return 500', async () => {
      const error = new DatabaseError('Could not retrieve tasks.');
      mockCodeTaskService.findByUserId.mockRejectedValue(error);

      await request(app).get(`/codetasks/${userId}`).expect(500);

      expect(mockCodeTaskService.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockCodeTaskService.findByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /codetasks/:id/:userId', () => {
    const userId = 'TEST_USER12345';
    const id = '1';

    it('should update a CodeTask and return 204', async () => {
      const updates = codeTaskUpdateValidation.parse({
        type: 'TODO',
        content: 'Updated content',
        priority: CodeTaskPriority.HIGH,
        status: 'done',
      });

      mockCodeTaskService.update.mockResolvedValue();

      await request(app)
        .put(`/codetasks/${id}/${userId}`)
        .send(updates)
        .expect(204);

      expect(mockCodeTaskService.update).toHaveBeenCalledWith(
        id,
        userId,
        updates
      );
      expect(mockCodeTaskService.update).toHaveBeenCalledTimes(1);
    });

    it('should handle updating a non-existent task and return 404', async () => {
      const updates = codeTaskUpdateValidation.parse({
        type: 'TODO',
        content: 'Updated content',
        priority: CodeTaskPriority.HIGH,
        status: 'done',
      });

      const error = new NotFoundError(`Task with ID ${id} not found.`);
      mockCodeTaskService.update.mockRejectedValue(error);

      await request(app)
        .put(`/codetasks/${id}/${userId}`)
        .send(updates)
        .expect(404);

      expect(mockCodeTaskService.update).toHaveBeenCalledWith(
        id,
        userId,
        updates
      );
      expect(mockCodeTaskService.update).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors and return 500 ', async () => {
      const updates = codeTaskUpdateValidation.parse({
        type: 'TODO',
        content: 'Updated content',
        priority: CodeTaskPriority.HIGH,
        status: 'done',
      });

      const error = new DatabaseError('DynamoDB error');
      mockCodeTaskService.update.mockRejectedValue(error);

      await request(app)
        .put(`/codetasks/${id}/${userId}`)
        .send(updates)
        .expect(500);

      expect(mockCodeTaskService.update).toHaveBeenCalledWith(
        id,
        userId,
        updates
      );
      expect(mockCodeTaskService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /codetasks/:id/:userId', () => {
    const userId = 'TEST_USER12345';
    const id = '1';

    it('should delete a CodeTask and return 204', async () => {
      mockCodeTaskService.delete.mockResolvedValue();

      await request(app).delete(`/codetasks/${id}/${userId}`).expect(204);

      expect(mockCodeTaskService.delete).toHaveBeenCalledWith(id, userId);
      expect(mockCodeTaskService.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle deleting a non-existent task and return 404', async () => {
      const error = new NotFoundError(`Task with ID ${id} not found.`);
      mockCodeTaskService.delete.mockRejectedValue(error);

      await request(app).delete(`/codetasks/${id}/${userId}`).expect(404);

      expect(mockCodeTaskService.delete).toHaveBeenCalledWith(id, userId);
      expect(mockCodeTaskService.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors and return 500', async () => {
      const error = new DatabaseError('DynamoDB error');
      mockCodeTaskService.delete.mockRejectedValue(error);

      await request(app).delete(`/codetasks/${id}/${userId}`).expect(500);

      expect(mockCodeTaskService.delete).toHaveBeenCalledWith(id, userId);
      expect(mockCodeTaskService.delete).toHaveBeenCalledTimes(1);
    });
  });
});
