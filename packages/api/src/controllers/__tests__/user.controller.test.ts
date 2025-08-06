import { describe, MockedFunction, it, expect, vi, beforeEach } from 'vitest';
import { UserController } from '../user.controller';
import { IUserService } from '../../services/user.service';
import { errorHandlerMiddleware } from '../../middlewares/error_handler.middleware';
import express, { Express } from 'express';
import request from 'supertest';
import { generateUUID } from '../../utils/uuid.utils';
import { VALIDATION_CONSTANTS } from '../../constants/validations';
import { ConflictError } from '../../utils/errors.utils';

const mockUserService = {
  create: vi.fn() as MockedFunction<IUserService['create']>,
  findById: vi.fn() as MockedFunction<IUserService['findById']>,
  findByEmail: vi.fn() as MockedFunction<IUserService['findByEmail']>,
  update: vi.fn() as MockedFunction<IUserService['update']>,
  delete: vi.fn() as MockedFunction<IUserService['delete']>,
  updateLastLogin: vi.fn() as MockedFunction<IUserService['updateLastLogin']>,
  updatePassword: vi.fn() as MockedFunction<IUserService['updatePassword']>,
  deactivateUser: vi.fn() as MockedFunction<IUserService['deactivateUser']>,
};

const userControllerInstance = UserController(mockUserService);

const createTestApp = () => {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.post('/user', userControllerInstance.createUser);

  app.use(errorHandlerMiddleware);

  return app;
};

describe('User Controller', () => {
  let app: Express;

  beforeEach(() => {
    app = createTestApp();
    vi.clearAllMocks();
  });

  describe('POST /user', () => {
    const validData = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      passwordHash: '1'.repeat(
        VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
      ),
    };

    it('should create new user and return 201', async () => {
      mockUserService.create.mockResolvedValue({
        ...validData,
        userId: generateUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      });

      const response = await request(app).post('/user').send(validData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          email: validData.email,
          firstName: validData.firstName,
          lastName: validData.lastName,
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          isActive: true,
        })
      );
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('should return 400 if email is missing', async () => {
      const invalidData = { ...validData };

      delete invalidData.email;

      const response = await request(app).post('/user').send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user data');
    });

    it('should return 400 if passwordHash is too short', async () => {
      const invalidData = { ...validData, passwordHash: 'short' };

      const response = await request(app).post('/user').send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user data');
    });

    it('should return 409 if user/email already exists', async () => {
      mockUserService.create.mockRejectedValue(
        new ConflictError('User test@example.com already exists')
      );

      const response = await request(app).post('/user').send(validData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Conflict');
      expect(response.body).toHaveProperty(
        'message',
        'User test@example.com already exists'
      );
    });

    it('should return 413 if payload too large', async () => {
      const largeString = 'a'.repeat(1024 * 1024 + 1);

      const response = await request(app)
        .post('/user')
        .send({ ...validData, extraField: largeString });

      expect(response.status).toBe(413);
      expect(response.body).toHaveProperty('error', 'Payload Too Large');
    });

    it('should return 500 on unexpected errors', async () => {
      mockUserService.create.mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app).post('/user').send(validData);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });
});
