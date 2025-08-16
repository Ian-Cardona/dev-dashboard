import express from 'express';
import request from 'supertest';
import { describe, it, vi, expect, MockedFunction, beforeEach } from 'vitest';
import { errorHandlerMiddleware } from '../../middlewares/error_handler.middleware';
import { ICodeTaskService } from '../../services/codetask.service';
import { CodeTaskController } from '../codetask.controller';
import { generateUUID } from '../../utils/uuid.utils';

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
  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestApp();
  });

  describe('POST /codetasks', () => {
    let createTaskData;
    let expectedTask;

    beforeEach(() => {
      createTaskData = {
        userId: generateUUID(),
        content: 'Test Task',
        filePath: 'test-file.ts',
        lineNumber: 1,
        type: 'TODO',
        priority: 'low',
        status: 'todo',
      };
      expectedTask = {
        ...createTaskData,
        id: generateUUID(),
        syncedAt: new Date().toISOString(),
      };
    });

    it('should create a new code task when data is valid', async () => {
      mockCodeTaskService.create.mockResolvedValue(expectedTask);
      const res = await request(app)
        .post('/codetasks')
        .send(createTaskData)
        .expect(201);

      expect(res.body).toEqual(expectedTask);
      expect(mockCodeTaskService.create).toHaveBeenCalledWith(createTaskData);
    });

    it('should return 400 on validation error (e.g., missing content)', async () => {
      const invalidData = { ...createTaskData, content: '' };
      await request(app).post('/codetasks').send(invalidData).expect(400);
      expect(mockCodeTaskService.create).not.toHaveBeenCalled();
    });

    it('should return 500 on a service or database error', async () => {
      mockCodeTaskService.create.mockRejectedValue(new Error('DB error'));
      await request(app).post('/codetasks').send(createTaskData).expect(500);
      expect(mockCodeTaskService.create).toHaveBeenCalledWith(createTaskData);
    });
  });

  describe('GET /codetasks/:userId', () => {
    let userId;

    beforeEach(() => {
      userId = generateUUID();
    });

    it('should return tasks for a given user ID', async () => {
      const expectedCodeTaskInfo = {
        userId,
        data: [],
        meta: {
          totalCount: 0,
          lastScanAt: new Date().toISOString(),
          scannedFiles: 0,
        },
      };
      mockCodeTaskService.findByUserId.mockResolvedValue(expectedCodeTaskInfo);

      const res = await request(app).get(`/codetasks/${userId}`).expect(200);

      expect(res.body).toEqual(expectedCodeTaskInfo);
      expect(mockCodeTaskService.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should return 400 for an invalid user ID format', async () => {
      await request(app).get('/codetasks/invalid-uuid').expect(400);
      expect(mockCodeTaskService.findByUserId).not.toHaveBeenCalled();
    });

    it('should return 500 on a service or database error', async () => {
      mockCodeTaskService.findByUserId.mockRejectedValue(new Error('DB error'));
      await request(app).get(`/codetasks/${userId}`).expect(500);
      expect(mockCodeTaskService.findByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('PUT /codetasks/:id/:userId', () => {
    let updateTaskData;
    const taskId = generateUUID();
    const userId = generateUUID();

    beforeEach(() => {
      updateTaskData = {
        content: 'Updated Task',
        filePath: 'test-file.ts',
        lineNumber: 1,
        priority: 'high',
        status: 'in-progress',
        type: 'TODO',
      };
    });

    it('should update a task when data is valid', async () => {
      const res = await request(app)
        .put(`/codetasks/${taskId}/${userId}`)
        .send(updateTaskData)
        .expect(204);

      expect(res.body).toEqual({});
    });

    it('should return 400 for invalid payload', async () => {
      await request(app)
        .put(`/codetasks/${taskId}/${userId}`)
        .send({ content: '' })
        .expect(400);

      expect(mockCodeTaskService.update).not.toHaveBeenCalled();
    });

    it('should return 500 on a service or database error', async () => {
      mockCodeTaskService.update.mockRejectedValue(new Error('DB error'));
      await request(app)
        .put(`/codetasks/${taskId}/${userId}`)
        .send(updateTaskData)
        .expect(500);
      expect(mockCodeTaskService.update).toHaveBeenCalledWith(
        taskId,
        userId,
        updateTaskData
      );
    });
  });

  describe('DELETE /codetasks/:id', () => {
    const taskId = generateUUID();
    const userId = generateUUID();

    it('should delete a task for the authenticated user', async () => {
      mockCodeTaskService.delete.mockResolvedValue(undefined);

      await request(app).delete(`/codetasks/${taskId}/${userId}`).expect(204);

      expect(mockCodeTaskService.delete).toHaveBeenCalledWith(taskId, userId);
    });

    it('should return 500 on a service or database error', async () => {
      mockCodeTaskService.delete.mockRejectedValue(new Error('DB error'));
      await request(app).delete(`/codetasks/${taskId}/${userId}`).expect(500);
      expect(mockCodeTaskService.delete).toHaveBeenCalledWith(taskId, userId);
    });
  });
});
