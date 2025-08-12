import { describe, MockedFunction, it, expect, vi, beforeEach } from 'vitest';
import { UserController } from '../user.controller';
import { IUserService } from '../../services/user.service';
import { errorHandlerMiddleware } from '../../middlewares/error_handler.middleware';
import express, { Express } from 'express';
import request from 'supertest';
import { generateUUID } from '../../utils/uuid.utils';
import { VALIDATION_CONSTANTS } from '../../constants/validations';
import { ConflictError, NotFoundError } from '../../utils/errors.utils';

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

  app.post('/users', userControllerInstance.createUser);

  app.get('/users/id/:userId', userControllerInstance.getUserById);

  app.get('/users/by-email', userControllerInstance.getUserByEmail);

  app.put('/users/:userId', userControllerInstance.updateUser);
  app.delete('/users/:userId', userControllerInstance.deleteUser);

  app.patch(
    '/users/:userId/last-login',
    userControllerInstance.updateLastLogin
  );

  app.patch('/users/:userId/password', userControllerInstance.updatePassword);

  app.patch('/users/:userId/deactivate', userControllerInstance.deactivateUser);

  app.use(errorHandlerMiddleware);

  return app;
};

describe('User Controller', () => {
  let app: Express;
  const testUserId = generateUUID();
  const testEmail = 'test@example.com';

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
      const { passwordHash, ...rest } = validData;

      const expectedResult = {
        ...rest,
        userId: generateUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };

      mockUserService.create.mockResolvedValue(expectedResult);

      const response = await request(app).post('/users').send(validData);

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

      const response = await request(app).post('/users').send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user data');
    });

    it('should return 400 if passwordHash is too short', async () => {
      const invalidData = { ...validData, passwordHash: 'short' };

      const response = await request(app).post('/users').send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user data');
    });

    it('should return 409 if user/email already exists', async () => {
      mockUserService.create.mockRejectedValue(
        new ConflictError('User test@example.com already exists')
      );

      const response = await request(app).post('/users').send(validData);

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
        .post('/users')
        .send({ ...validData, extraField: largeString });

      expect(response.status).toBe(413);
      expect(response.body).toHaveProperty('error', 'Payload Too Large');
    });

    it('should return 500 on unexpected errors', async () => {
      mockUserService.create.mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app).post('/users').send(validData);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('GET /user/:userId - findById', () => {
    const mockUser = {
      userId: testUserId,
      email: testEmail,
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    it('should return user by ID and return 200', async () => {
      mockUserService.findById.mockResolvedValue(mockUser);

      const response = await request(app).get(`/users/id/${testUserId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(mockUserService.findById).toHaveBeenCalledWith(testUserId);
    });

    it('should return 400 if userId is invalid UUID', async () => {
      const invalidUserId = 'invalid-uuid';

      const response = await request(app).get(`/users/id/${invalidUserId}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user ID');
    });

    it('should return 404 if user not found', async () => {
      mockUserService.findById.mockRejectedValue(
        new NotFoundError('User not found')
      );

      const response = await request(app).get(`/users/id/${testUserId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 500 on unexpected errors', async () => {
      mockUserService.findById.mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app).get(`/users/id/${testUserId}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('GET /users/by-email - findByEmail', () => {
    const mockUser = {
      userId: testUserId,
      email: testEmail,
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    it('should return user by email and return 200', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/users/by-email')
        .query({ email: testEmail });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(testEmail);
    });

    it('should return 400 if email is invalid', async () => {
      const invalidEmail = 'invalid-email';

      const response = await request(app)
        .get('/users/by-email')
        .query({ email: invalidEmail });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid email format');
    });

    it('should return 404 if user not found', async () => {
      mockUserService.findByEmail.mockRejectedValue(
        new NotFoundError('User not found')
      );

      const response = await request(app)
        .get('/users/by-email')
        .query({ email: testEmail });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 500 on unexpected errors', async () => {
      mockUserService.findByEmail.mockRejectedValue(
        new Error('Unexpected error')
      );

      const response = await request(app)
        .get('/users/by-email')
        .query({ email: testEmail });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('PUT /user/:userId - updateUser', () => {
    it('should update user and return 200', async () => {
      const validData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        passwordHash: '1'.repeat(
          VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
        ),
        emailVerified: false,
        passwordUpdatedAt: new Date().toISOString(),
      };

      const { passwordHash, ...rest } = validData;

      const expectedResult = {
        ...rest,
        userId: testUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        emailVerified: false,
        passwordUpdatedAt: new Date().toISOString(),
      };

      mockUserService.update.mockResolvedValue(expectedResult);

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send(validData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResult);
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('should return 400 if userId is invalid UUID', async () => {
      const invalidUserId = 'invalid-uuid';

      const response = await request(app)
        .put(`/users/${invalidUserId}`)
        .send({
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          passwordHash: '1'.repeat(
            VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
          ),
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user data');
    });

    it('should return 404 if user not found', async () => {
      mockUserService.update.mockRejectedValue(
        new NotFoundError('User not found')
      );

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send({
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          passwordHash: '1'.repeat(
            VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
          ),
          emailVerified: false,
          passwordUpdatedAt: new Date().toISOString(),
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 500 on unexpected errors', async () => {
      mockUserService.update.mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app)
        .put(`/users/${testUserId}`)
        .send({
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          passwordHash: '1'.repeat(
            VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
          ),
          emailVerified: false,
          passwordUpdatedAt: new Date().toISOString(),
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('DELETE /users/:userId - deleteUser', () => {
    it('should delete user and return 204', async () => {
      mockUserService.delete.mockResolvedValue();

      const response = await request(app).delete(`/users/${testUserId}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(mockUserService.delete).toHaveBeenCalledWith(testUserId);
    });

    it('should return 400 if userId is invalid', async () => {
      const invalidUserId = 'invalid-uuid';

      const response = await request(app).delete(`/users/${invalidUserId}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user ID');
      expect(mockUserService.delete).not.toHaveBeenCalled();
    });

    it('should return 404 if user to delete not found', async () => {
      mockUserService.delete.mockRejectedValue(
        new NotFoundError('User not found')
      );

      const response = await request(app).delete(`/users/${testUserId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 500 on unexpected errors', async () => {
      mockUserService.delete.mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app).delete(`/users/${testUserId}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('PATCH /users/:userId/last-login - updateLastLogin', () => {
    const validBody = { lastLogin: new Date().toISOString() };

    it('should update last login and return updated user', async () => {
      const updatedUser = {
        userId: testUserId,
        email: testEmail,
        firstName: 'Test',
        lastName: 'User',
        lastLogin: validBody.lastLogin,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };

      mockUserService.updateLastLogin.mockResolvedValue(updatedUser);

      const response = await request(app)
        .patch(`/users/${testUserId}/last-login`)
        .send(validBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
      expect(mockUserService.updateLastLogin).toHaveBeenCalledWith(
        testUserId,
        validBody.lastLogin
      );
    });

    it('should return 400 on invalid userId', async () => {
      const response = await request(app)
        .patch(`/users/invalid-uuid/last-login`)
        .send(validBody);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid date format');
      expect(mockUserService.updateLastLogin).not.toHaveBeenCalled();
    });

    it('should return 400 on invalid date format in body', async () => {
      const response = await request(app)
        .patch(`/users/${testUserId}/last-login`)
        .send({ lastLogin: 'not-a-date' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid date format');
      expect(mockUserService.updateLastLogin).not.toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      mockUserService.updateLastLogin.mockRejectedValue(
        new NotFoundError('User not found')
      );

      const response = await request(app)
        .patch(`/users/${testUserId}/last-login`)
        .send(validBody);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });

    it('should return 500 on unexpected errors', async () => {
      mockUserService.updateLastLogin.mockRejectedValue(
        new Error('Unexpected error')
      );

      const response = await request(app)
        .patch(`/users/${testUserId}/last-login`)
        .send(validBody);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });
  describe('PATCH /users/:userId/password - updatePassword', () => {
    const validBody = {
      passwordHash: 'a'.repeat(
        VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
      ),
    };

    it('should update password and return 204', async () => {
      const response = await request(app)
        .patch(`/users/${testUserId}/password`)
        .send(validBody);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(mockUserService.updatePassword).toHaveBeenCalledWith(
        testUserId,
        validBody.passwordHash
      );
    });

    it('should return 400 on missing or invalid passwordHash', async () => {
      const response = await request(app)
        .patch(`/users/${testUserId}/password`)
        .send({ passwordHash: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user ID format');
      expect(mockUserService.updatePassword).not.toHaveBeenCalled();
    });

    it('should return 400 on invalid userId', async () => {
      const response = await request(app)
        .patch(`/users/invalid-uuid/password`)
        .send(validBody);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user ID format');
      expect(mockUserService.updatePassword).not.toHaveBeenCalled();
    });

    it('should return 400 on missing or invalid passwordHash', async () => {
      const response = await request(app)
        .patch(`/users/${testUserId}/password`)
        .send({ passwordHash: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user ID format');
      expect(mockUserService.updatePassword).not.toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      mockUserService.updatePassword.mockRejectedValue(
        new NotFoundError('User not found')
      );

      const response = await request(app)
        .patch(`/users/${testUserId}/password`)
        .send(validBody);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });

    it('should return 500 on unexpected errors', async () => {
      mockUserService.updatePassword.mockRejectedValue(
        new Error('Unexpected error')
      );

      const response = await request(app)
        .patch(`/users/${testUserId}/password`)
        .send(validBody);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });

  describe('PATCH /users/:userId/deactivate - deactivateUser', () => {
    it('should deactivate user and return 204', async () => {
      const response = await request(app).patch(
        `/users/${testUserId}/deactivate`
      );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(mockUserService.deactivateUser).toHaveBeenCalledWith(testUserId);
    });

    it('should return 400 on invalid userId', async () => {
      const response = await request(app).patch(
        `/users/invalid-uuid/deactivate`
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user ID format');
      expect(mockUserService.deactivateUser).not.toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      mockUserService.deactivateUser.mockRejectedValue(
        new NotFoundError('User not found')
      );

      const response = await request(app).patch(
        `/users/${testUserId}/deactivate`
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });

    it('should return 500 on unexpected errors', async () => {
      mockUserService.deactivateUser.mockRejectedValue(
        new Error('Unexpected error')
      );

      const response = await request(app).patch(
        `/users/${testUserId}/deactivate`
      );

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });
  });
});
