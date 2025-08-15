import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { authorizationMiddleware } from '../../middlewares/authorization.middleware';
import { errorHandlerMiddleware } from '../../middlewares/error_handler.middleware';
import { UserController } from '../user.controller';
import { IUserService } from '../../services/user.service';
import { MockedFunction } from 'vitest';
import { generateUUID } from '../../utils/uuid.utils';
import { NotFoundError } from '../../utils/errors.utils';

const mockUserService = {
  create: vi.fn() as MockedFunction<IUserService['create']>,
  findById: vi.fn() as MockedFunction<IUserService['findById']>,
  findByEmailForAuth: vi.fn() as MockedFunction<
    IUserService['findByEmailForAuth']
  >,
  findByEmailForPublic: vi.fn() as MockedFunction<
    IUserService['findByEmailForPublic']
  >,
  update: vi.fn() as MockedFunction<IUserService['update']>,
  delete: vi.fn() as MockedFunction<IUserService['delete']>,
  updateLastLogin: vi.fn() as MockedFunction<IUserService['updateLastLogin']>,
  updatePassword: vi.fn() as MockedFunction<IUserService['updatePassword']>,
  deactivateUser: vi.fn() as MockedFunction<IUserService['deactivateUser']>,
};

const userId = generateUUID();

vi.mock('../../middlewares/authorization.middleware', () => ({
  authorizationMiddleware: (req, res, next) => {
    req.user = { userId, email: 'test@example.com' };
    next();
  },
}));

const userControllerInstance = UserController(mockUserService);

const createTestApp = () => {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get(
    '/profile/:userId',
    authorizationMiddleware,
    userControllerInstance.getUserProfile
  );
  app.put(
    '/profile/:userId',
    authorizationMiddleware,
    userControllerInstance.updateUserAccount
  );
  app.put(
    '/password/:userId',
    authorizationMiddleware,
    userControllerInstance.updateUserPassword
  );
  app.delete(
    '/account/:userId',
    authorizationMiddleware,
    userControllerInstance.deactivateUserAccount
  );

  app.use(errorHandlerMiddleware);
  return app;
};

describe('UserController', () => {
  let app: express.Express;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createTestApp();
  });

  describe('GET /profile/:userId', () => {
    it('should return user profile when valid userId', async () => {
      mockUserService.findById.mockResolvedValueOnce({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userId,
        isActive: true,
      });

      const res = await request(app).get(`/profile/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userId,
        isActive: true,
      });
      expect(mockUserService.findById).toHaveBeenCalledWith(userId);
    });

    it('should return 400 when userId is invalid (Zod)', async () => {
      const res = await request(app).get(`/profile/invalid-uuid`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('User lookup failed');
      expect(mockUserService.findById).not.toHaveBeenCalled();
    });

    it('should return 404 when user is not found', async () => {
      mockUserService.findById.mockRejectedValueOnce(
        new NotFoundError('User not found')
      );

      const res = await request(app).get(`/profile/${userId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /profile/:userId', () => {
    it('should update user account when valid', async () => {
      mockUserService.update.mockResolvedValueOnce({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userId,
        isActive: true,
      });

      await request(app)
        .put(`/profile/${userId}`)
        .send({
          firstName: 'Updated',
          email: 'test@example.com',
          passwordHash: 'hashedPassHere',
        })
        .expect(200);

      expect(mockUserService.update).toHaveBeenCalledWith(userId, {
        email: 'test@example.com',
        firstName: 'Updated',
        passwordHash: 'hashedPassHere',
      });
    });

    it('should return 400 when body fails validation', async () => {
      await request(app).put(`/profile/${userId}`).send({ firstName: '' });

      expect(mockUserService.update).not.toHaveBeenCalled();
    });
  });

  describe('PUT /password/:userId', () => {
    it('should update password when valid', async () => {
      await request(app).put(`/password/${userId}`).send({
        currentPassword: 'weak',
        newPassword: 'Str0ng!Pass',
        confirmPassword: 'Str0ng!Pass',
      });

      expect(mockUserService.updatePassword).toHaveBeenCalledWith(
        userId,
        'Str0ng!Pass'
      );
    });

    it('should return 400 for invalid password format', async () => {
      await request(app).put(`/password/${userId}`).send({
        currentPassword: 'weak',
        newPassword: 'weak',
        confirmPassword: 'weak',
      });

      expect(mockUserService.updatePassword).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /account/:userId', () => {
    it('should deactivate user when valid', async () => {
      await request(app).delete(`/account/${userId}`);

      expect(mockUserService.deactivateUser).toHaveBeenCalledWith(userId);
    });

    it('should return 400 for invalid userId', async () => {
      await request(app).delete('/account/invalid-uuid');

      expect(mockUserService.deactivateUser).not.toHaveBeenCalled();
    });
  });
});
