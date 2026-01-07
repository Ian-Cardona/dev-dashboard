import { IUserService } from '../interfaces/iuser.service';
import { UserController } from '../user.controller';
import { UserPublic, GithubProvider } from '@dev-dashboard/shared';
import express, { Express } from 'express';
import request from 'supertest';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('UserController', () => {
  let app: Express;
  let mockUserService: IUserService;
  let mockUserPublic: UserPublic;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUserPublic = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
      role: 'user',
      providers: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    mockUserService = {
      createByEmail: vi.fn(),
      createByOAuth: vi.fn(),
      findById: vi.fn(),
      findByEmailPrivate: vi.fn(),
      findByEmailPublic: vi.fn(),
      emailExists: vi.fn(),
      findByProvider: vi.fn(),
      findProviderByUserId: vi.fn(),
      findProvidersByUserId: vi.fn(),
      linkProvider: vi.fn(),
      unlinkProvider: vi.fn(),
      updateProvider: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateLastLogin: vi.fn(),
      updatePassword: vi.fn(),
      deactivate: vi.fn(),
    };

    app = express();
    app.use(express.json());

    app.use((req, _res, next) => {
      req.user = { userId: '550e8400-e29b-41d4-a716-446655440000' };
      next();
    });

    const userController = UserController(mockUserService);

    app.get('/api/user/profile', userController.getUserProfile);
    app.patch('/api/user/account', userController.updateUserAccount);
    app.patch('/api/user/password', userController.updateUserPassword);
    app.delete('/api/user/account', userController.deactivateUserAccount);
    app.get('/api/user/providers', userController.findProvidersByUserId);

    app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: 'Not found' });
      }
      if (error.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (error.name === 'ConflictError') {
        return res.status(409).json({ error: 'Conflict' });
      }
      res.status(500).json({ error: 'Internal server error' });
    });
  });

  describe('GET /api/user/profile', () => {
    it('returns user profile with 200 status', async () => {
      vi.mocked(mockUserService.findById).mockResolvedValue(mockUserPublic);

      const response = await request(app).get('/api/user/profile');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserPublic);
    });

    it('returns 404 when user not found', async () => {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      vi.mocked(mockUserService.findById).mockRejectedValue(error);

      const response = await request(app).get('/api/user/profile');

      expect(response.status).toBe(404);
    });

    it('returns 500 on server error', async () => {
      vi.mocked(mockUserService.findById).mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app).get('/api/user/profile');

      expect(response.status).toBe(500);
    });
  });

  describe('PATCH /api/user/account', () => {
    it('updates user and returns updated data with 200 status', async () => {
      const updates = { firstName: 'Jane', lastName: 'Smith' };
      const updatedUser = { ...mockUserPublic, ...updates };
      vi.mocked(mockUserService.update).mockResolvedValue(updatedUser);

      const response = await request(app)
        .patch('/api/user/account')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('Jane');
      expect(response.body.lastName).toBe('Smith');
    });

    it('returns 404 when user not found', async () => {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      vi.mocked(mockUserService.update).mockRejectedValue(error);

      const response = await request(app)
        .patch('/api/user/account')
        .send({ firstName: 'Jane', lastName: 'Smith' });

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/user/password', () => {
    it('updates password successfully with 204 status', async () => {
      vi.mocked(mockUserService.updatePassword).mockResolvedValue(
        mockUserPublic
      );

      const response = await request(app).patch('/api/user/password').send({
        currentPassword: 'oldPassword123',
        newPassword: 'NewPassword456!',
        confirmPassword: 'NewPassword456!',
      });

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('returns 401 for incorrect current password', async () => {
      const error = new Error('Invalid password');
      error.name = 'UnauthorizedError';
      vi.mocked(mockUserService.updatePassword).mockRejectedValue(error);

      const response = await request(app).patch('/api/user/password').send({
        currentPassword: 'wrongPassword',
        newPassword: 'NewPassword456!',
        confirmPassword: 'NewPassword456!',
      });

      expect(response.status).toBe(401);
    });

    it('returns 404 when user not found', async () => {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      vi.mocked(mockUserService.updatePassword).mockRejectedValue(error);

      const response = await request(app).patch('/api/user/password').send({
        currentPassword: 'oldPassword123',
        newPassword: 'NewPassword456!',
        confirmPassword: 'NewPassword456!',
      });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/user/account', () => {
    it('deactivates account successfully with 204 status', async () => {
      vi.mocked(mockUserService.deactivate).mockResolvedValue({
        ...mockUserPublic,
        isActive: false,
      });

      const response = await request(app).delete('/api/user/account');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('returns 404 when user not found', async () => {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      vi.mocked(mockUserService.deactivate).mockRejectedValue(error);

      const response = await request(app).delete('/api/user/account');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/user/providers', () => {
    it('returns list of linked providers with 200 status', async () => {
      const mockProviders: GithubProvider[] = [
        {
          provider: 'github',
          providerUserId: 'github123',
          accessTokenEncrypted: 'encrypted',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      vi.mocked(mockUserService.findProvidersByUserId).mockResolvedValue(
        mockProviders
      );

      const response = await request(app).get('/api/user/providers');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProviders);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].provider).toBe('github');
    });

    it('returns empty array when no providers linked', async () => {
      vi.mocked(mockUserService.findProvidersByUserId).mockResolvedValue([]);

      const response = await request(app).get('/api/user/providers');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('returns 500 on service error', async () => {
      vi.mocked(mockUserService.findProvidersByUserId).mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app).get('/api/user/providers');

      expect(response.status).toBe(500);
    });
  });
});
