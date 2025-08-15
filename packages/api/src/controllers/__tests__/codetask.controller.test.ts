import express from 'express';
import request from 'supertest';
import { describe, it, vi, expect, MockedFunction, beforeEach } from 'vitest';
import { errorHandlerMiddleware } from '../../middlewares/error_handler.middleware';
import { ICodeTaskService } from '../../services/codetask.service';
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

describe('CodeTaskController', () => {
  let app: express.Express;
  let mockTask;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestApp();

    mockTask = {
      id: 'task-1',
      userId: 'user-123',
      content: 'Test Task',
      filePath: 'test-file.ts',
      lineNumber: 1,
      syncedAt: new Date().toISOString(),
      priority: 'low',
      status: 'todo',
      type: 'TODO',
    };
  });

  describe('POST /codetasks', () => {
    it('should create a new code task when valid', async () => {
      mockCodeTaskService.create.mockResolvedValue(mockTask);

      const res = await request(app).post('/codetasks').send({}).expect(201);

      expect(res.body).toEqual(mockTask);
      expect(mockCodeTaskService.create).toHaveBeenCalledWith({});
    });

    it('should return 400 on validation error', async () => {
      await request(app)
        .post('/codetasks')
        .send({ description: 'Missing title' })
        .expect(400);
      expect(mockCodeTaskService.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /codetasks', () => {
    it('should return tasks for the authenticated user', async () => {
      const mockTasks = { tasks: [], total: 0 };
      mockCodeTaskService.findByUserId.mockResolvedValue(mockTasks);

      const res = await request(app).get('/codetasks').expect(200);

      expect(res.body).toEqual(mockTasks);
      expect(mockCodeTaskService.findByUserId).toHaveBeenCalledWith('user-123');
    });
  });

  describe('PUT /codetasks/:id', () => {
    it('should update a task when data is valid', async () => {
      const updatedTask = {
        id: 'task-1',
        userId: 'user-123',
        content: 'Updated Task',
        filePath: 'test-file.ts',
        lineNumber: 1,
        syncedAt: new Date().toISOString(),
        priority: 'high',
        status: 'in-progress',
        type: 'TODO',
      };

      mockCodeTaskService.update.mockResolvedValue(updatedTask);

      const res = await request(app)
        .put('/codetasks/task-1')
        .send({
          content: 'Updated Task',
          filePath: 'test-file.ts',
          lineNumber: 1,
          priority: 'high',
          status: 'in-progress',
          type: 'TODO',
        })
        .expect(200);

      expect(res.body).toEqual(updatedTask);
      expect(mockCodeTaskService.update).toHaveBeenCalledWith(
        'task-1',
        'user-123',
        {
          content: 'Updated Task',
          filePath: 'test-file.ts',
          lineNumber: 1,
          priority: 'high',
          status: 'in-progress',
          type: 'TODO',
        }
      );
    });

    it('should return 400 for invalid payload', async () => {
      await request(app)
        .put('/codetasks/task-1')
        .send({ title: '' }) // invalid
        .expect(400);

      expect(mockCodeTaskService.update).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /codetasks/:id', () => {
    it('should delete a task for the authenticated user', async () => {
      mockCodeTaskService.delete.mockResolvedValue(undefined);

      await request(app).delete('/codetasks/task-1').expect(204);

      expect(mockCodeTaskService.delete).toHaveBeenCalledWith(
        'task-1',
        'user-123'
      );
    });
  });
});
