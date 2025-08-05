import express, { Express } from 'express';
import request from 'supertest';
import { describe, it, vi, beforeEach, expect, MockedFunction } from 'vitest';
import { errorHandlerMiddleware } from '../../middlewares/error_handler.middleware';
import { ICodeTaskService } from '../../services/codetask.service';
import { DatabaseError, NotFoundError } from '../../utils/errors.utils';
import {
  CodeTask,
  CodeTaskPriority,
  CodeTasksInfo,
} from '../../types/codetask.type';
import { codeTaskUpdateValidation } from '../../validations/codetask.validation';
import { generateCodeTaskId, generateUserId } from '../../utils/uuid.utils';
import { CodeTaskController } from '../codetask.controller';

const mockCodeTaskService = {
  create: vi.fn() as MockedFunction<ICodeTaskService['create']>,
  findByUserId: vi.fn() as MockedFunction<ICodeTaskService['findByUserId']>,
  update: vi.fn() as MockedFunction<ICodeTaskService['update']>,
  delete: vi.fn() as MockedFunction<ICodeTaskService['delete']>,
};

const codeTaskControllerInstance = CodeTaskController(mockCodeTaskService);

const createTestApp = () => {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.post('/codetasks', codeTaskControllerInstance.createCodeTask);
  app.get(
    '/codetasks/:userId',
    codeTaskControllerInstance.findCodeTasksInfoByUserId
  );
  app.put('/codetasks/:id/:userId', codeTaskControllerInstance.updateCodeTask);
  app.delete(
    '/codetasks/:id/:userId',
    codeTaskControllerInstance.deleteCodeTask
  );

  app.use(errorHandlerMiddleware);

  return app;
};

describe('CodeTask Controller', () => {
  let app: Express;

  beforeEach(() => {
    app = createTestApp();
    vi.clearAllMocks();
  });

  describe('POST /codetasks', () => {
    const validData = {
      userId: generateUserId(),
      content: 'This is a test content. Please ignore.',
      filePath: '/This/Is/A/Test/FilePath',
      lineNumber: 1,
      priority: CodeTaskPriority.LOW,
      status: 'todo',
      type: 'TODO',
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should create new CodeTask and return 201', async () => {
      const mockResponse: CodeTask = {
        id: generateCodeTaskId(),
        userId: generateUserId(),
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
          expect(res.body).toEqual(
            expect.objectContaining({
              content: 'This is a test content. Please ignore.',
              filePath: '/This/Is/A/Test/FilePath',
              lineNumber: 1,
              priority: 'low',
              status: 'todo',
              type: 'TODO',
            })
          );
          expect(res.body.id).toBeDefined();
          expect(res.body.userId).toBeDefined();
          expect(res.body.syncedAt).toBeDefined();
        });

      expect(mockCodeTaskService.create).toHaveBeenCalledWith(validData);
      expect(mockCodeTaskService.create).toHaveBeenCalledTimes(1);
    });

    it('should reject invalid data and return 400', async () => {
      const invalidData = {
        content: 'This is a test content. Please ignore.',
        filePath: '/This/Is/A/Test/FilePath',
        lineNumber: 0, // Invalid value
        priority: CodeTaskPriority.LOW,
        status: 'todo',
        type: 'TODO',
      };

      await request(app).post('/codetasks').send(invalidData).expect(400);

      expect(mockCodeTaskService.create).not.toHaveBeenCalled();
      expect(mockCodeTaskService.create).toHaveBeenCalledTimes(0);
    });

    it('should reject missing required field and return 400', async () => {
      const invalidData = {
        filePath: '/This/Is/A/Test/FilePath',
        lineNumber: 1,
        priority: CodeTaskPriority.LOW,
        status: 'todo',
        type: 'TODO',
      };

      await request(app).post('/codetasks').send(invalidData).expect(400);

      expect(mockCodeTaskService.create).not.toHaveBeenCalled();
      expect(mockCodeTaskService.create).toHaveBeenCalledTimes(0);
    });

    it('should reject malformed JSON and return 400', async () => {
      await request(app)
        .post('/codetasks')
        .set('Content-Type', 'application/json')
        .send('{ "broken": ')
        .expect(400)
        .expect(res => {
          expect(res.body.error).toBe('Invalid JSON');
          expect(res.get('Content-Type')).toMatch(/json/);
        });
    });

    it('should reject extremely large request body and return 413', async () => {
      const largePayload = {
        content: 'a'.repeat(1024 * 1024 * 2),
        filePath: '/path/to/file',
        lineNumber: 1,
        priority: CodeTaskPriority.HIGH,
        status: 'todo',
        type: 'TODO',
      };

      await request(app)
        .post('/codetasks')
        .set('Content-Type', 'application/json')
        .send(largePayload)
        .expect(413);
    });

    it('should reject oversized payloads before validation and return 413', async () => {
      const largePayload = { garbage: 'a'.repeat(1024 * 1024 * 2) };

      await request(app).post('/codetasks').send(largePayload).expect(413);
    });

    it('should handle service errors and return 500', async () => {
      const error = new DatabaseError('DynamoDB error');
      mockCodeTaskService.create.mockRejectedValue(error);

      await request(app)
        .post('/codetasks')
        .send(validData)
        .expect(500)
        .expect(res => {
          expect(res.body).toEqual({
            error: 'Database Error',
            message: 'DynamoDB error',
          });
        });

      expect(mockCodeTaskService.create).toHaveBeenCalledWith(validData);
      expect(mockCodeTaskService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /codetasks/:userId', () => {
    const userId = generateUserId();
    const validTask: CodeTask = {
      id: generateCodeTaskId(),
      userId,
      content: 'Test content',
      filePath: '/path/to/file',
      lineNumber: 1,
      syncedAt: new Date().toISOString(),
      priority: CodeTaskPriority.HIGH,
      status: 'todo',
      type: 'TODO',
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should find CodeTasks by userId and return 200', async () => {
      const mockResponse: CodeTasksInfo = {
        userId,
        data: [validTask],
        meta: {
          totalCount: 1,
          lastScanAt: '2025-01-01T00:00:00.000Z',
          scannedFiles: 1,
        },
      };

      mockCodeTaskService.findByUserId.mockResolvedValue(mockResponse);

      await request(app)
        .get(`/codetasks/${userId}`)
        .expect(200)
        .expect(res => {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.meta.totalCount).toBe(1);
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

    it('should reject invalid user id and return 400', async () => {
      const invalidUserId = 'invalid-user-id-123';
      await request(app).get(`/codetasks/${invalidUserId}`).expect(400);

      expect(mockCodeTaskService.findByUserId).not.toHaveBeenCalled();
      expect(mockCodeTaskService.findByUserId).toHaveBeenCalledTimes(0);
    });

    it('should reject userIDs longer than 50 chars and return 400', async () => {
      const longUserId = 'a'.repeat(51);
      await request(app).get(`/codetasks/${longUserId}`).expect(400);
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
    const userId = generateUserId();
    const id = generateCodeTaskId();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should update CodeTask and return 204', async () => {
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

    it('should handle updating non-existent task and return 404', async () => {
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

    it('should reject invalid user id and return 400', async () => {
      const invalidUserId = 'invalid-user-id';

      await request(app)
        .put(`/codetasks/${id}/${invalidUserId}`)
        .send({
          type: 'TODO',
          content: 'Updated content',
          priority: CodeTaskPriority.HIGH,
          status: 'done',
        })
        .expect(400);

      expect(mockCodeTaskService.update).not.toHaveBeenCalled();
      expect(mockCodeTaskService.update).toHaveBeenCalledTimes(0);
    });

    it('should reject invalid id and return 400', async () => {
      const invalidId = 'invalid-id';

      await request(app)
        .put(`/codetasks/${invalidId}/${userId}`)
        .send({
          type: 'TODO',
          content: 'Updated content',
          priority: CodeTaskPriority.HIGH,
          status: 'done',
        })
        .expect(400);

      expect(mockCodeTaskService.update).not.toHaveBeenCalled();
      expect(mockCodeTaskService.update).toHaveBeenCalledTimes(0);
    });

    it('should reject malformed JSON in request body and return 400', async () => {
      await request(app)
        .put(`/codetasks/${id}/${userId}`)
        .set('Content-Type', 'application/json')
        .send('malformed json')
        .expect(400);
    });

    it('should reject empty content during update and return 400', async () => {
      const response = await request(app)
        .put(`/codetasks/${id}/${userId}`)
        .send({
          type: 'TODO',
          content: '', // Empty string
          priority: CodeTaskPriority.HIGH,
          status: 'done',
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid code task data',
        details: [
          {
            code: 'too_small',
            message: 'Too small: expected string to have >=1 characters',
            inclusive: true,
            minimum: 1,
            origin: 'string',
            path: ['content'],
          },
        ],
      });

      expect(mockCodeTaskService.update).not.toHaveBeenCalled();
    });

    it('should handle service errors and return 500', async () => {
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
    const userId = generateUserId();
    const id = generateCodeTaskId();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should delete CodeTask and return 204', async () => {
      mockCodeTaskService.delete.mockResolvedValue();

      await request(app).delete(`/codetasks/${id}/${userId}`).expect(204);

      expect(mockCodeTaskService.delete).toHaveBeenCalledWith(id, userId);
      expect(mockCodeTaskService.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle deleting non-existent task and return 404', async () => {
      const error = new NotFoundError(`Task with ID ${id} not found.`);
      mockCodeTaskService.delete.mockRejectedValue(error);

      await request(app).delete(`/codetasks/${id}/${userId}`).expect(404);

      expect(mockCodeTaskService.delete).toHaveBeenCalledWith(id, userId);
      expect(mockCodeTaskService.delete).toHaveBeenCalledTimes(1);
    });

    it('should reject invalid user id and return 400', async () => {
      const invalidUserId = 'invalid-user-id';
      await request(app)
        .delete(`/codetasks/${id}/${invalidUserId}`)
        .expect(400);
      expect(mockCodeTaskService.delete).not.toHaveBeenCalled();
    });

    it('should reject invalid task id and return 400', async () => {
      const invalidId = 'invalid-id';
      await request(app)
        .delete(`/codetasks/${invalidId}/${userId}`)
        .expect(400);
      expect(mockCodeTaskService.delete).not.toHaveBeenCalled();
    });

    it('should handle service errors and return 500', async () => {
      const error = new DatabaseError('DynamoDB error');
      mockCodeTaskService.delete.mockRejectedValue(error);

      await request(app).delete(`/codetasks/${id}/${userId}`).expect(500);
      expect(mockCodeTaskService.delete).toHaveBeenCalledWith(id, userId);
    });
  });
});
