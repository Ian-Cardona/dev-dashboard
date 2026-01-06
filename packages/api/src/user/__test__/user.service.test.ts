import { IUserRepository } from '../interfaces/iuser.repository';
import { UserService } from '../user.service';
import {
  CompleteRegisterByEmailRequest,
  CompleteRegisterByOAuthRequest,
  User,
} from '@dev-dashboard/shared';
import * as bcryptUtils from 'src/utils/bcrypt.utils';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from 'src/utils/errors.utils';
import * as uuidUtils from 'src/utils/uuid.utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('src/utils/bcrypt.utils');
vi.mock('src/utils/uuid.utils');
vi.mock('src/config/env', () => ({
  ENV: {
    BCRYPT_SALT_ROUNDS_PW: '10',
  },
}));

describe('UserService', () => {
  let mockUserRepository: IUserRepository;
  let userService: ReturnType<typeof UserService>;
  let mockUser: User;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(uuidUtils.generateUUID).mockReturnValue('mock-uuid-123');

    mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      passwordHash: '$2b$10$mockhashedpassword',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
      role: 'user',
      providers: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    mockUserRepository = {
      createByEmail: vi.fn(),
      createByOAuth: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
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

    userService = UserService(mockUserRepository);
  });

  describe('createByEmail', () => {
    it('returns public user data when registration succeeds', async () => {
      const request: CompleteRegisterByEmailRequest = {
        email: 'test@example.com',
        passwordHash: '$2b$10$validhash',
        firstName: 'John',
        lastName: 'Doe',
      };

      vi.mocked(bcryptUtils.isBcryptHash).mockReturnValue(true);
      vi.mocked(mockUserRepository.createByEmail).mockResolvedValue(mockUser);

      const result = await userService.createByEmail(request);

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('rejects invalid bcrypt hash', async () => {
      vi.mocked(bcryptUtils.isBcryptHash).mockReturnValue(false);

      await expect(
        userService.createByEmail({
          email: 'test@example.com',
          passwordHash: 'invalid',
          firstName: 'John',
          lastName: 'Doe',
        })
      ).rejects.toThrow(`[UserService] Failed to create user`);
    });

    it('fails when email already exists', async () => {
      vi.mocked(bcryptUtils.isBcryptHash).mockReturnValue(true);
      vi.mocked(mockUserRepository.createByEmail).mockRejectedValue(
        new Error('ConditionalCheckFailedException')
      );

      await expect(
        userService.createByEmail({
          email: 'existing@example.com',
          passwordHash: '$2b$10$validhash',
          firstName: 'John',
          lastName: 'Doe',
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('createByOAuth', () => {
    it('returns public user data when OAuth registration succeeds', async () => {
      const request: CompleteRegisterByOAuthRequest = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        providers: [{ provider: 'github', providerUserId: 'github123' }],
        accessTokenEncrypted: 'encrypted-token',
      };

      vi.mocked(mockUserRepository.createByOAuth).mockResolvedValue(mockUser);

      const result = await userService.createByOAuth(request);

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('fails when provider already linked to another user', async () => {
      vi.mocked(mockUserRepository.createByOAuth).mockRejectedValue(
        new Error('ConditionalCheckFailedException')
      );

      await expect(
        userService.createByOAuth({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          providers: [{ provider: 'github', providerUserId: 'github123' }],
          accessTokenEncrypted: 'token',
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('findById', () => {
    it('returns public user data when user exists', async () => {
      vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);

      const result = await userService.findById('user-123');

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('fails when user does not exist', async () => {
      vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

      await expect(userService.findById('non-existent')).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('findByEmailPublic', () => {
    it('returns public user data when user exists', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);

      const result = await userService.findByEmailPublic('test@example.com');

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('fails when user does not exist', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

      await expect(
        userService.findByEmailPublic('notfound@example.com')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('findByEmailPrivate', () => {
    it('returns complete user data including password hash', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);

      const result = await userService.findByEmailPrivate('test@example.com');

      expect(result).toEqual(mockUser);
    });

    it('fails when user does not exist', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

      await expect(
        userService.findByEmailPrivate('notfound@example.com')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('emailExists', () => {
    it('returns true when email is registered', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);

      const result = await userService.emailExists('test@example.com');

      expect(result).toBe(true);
    });

    it('returns false when email is not registered', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

      const result = await userService.emailExists('notfound@example.com');

      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('returns updated public user data', async () => {
      const updatedUser = { ...mockUser, firstName: 'Jane', lastName: 'Smith' };
      vi.mocked(mockUserRepository.update).mockResolvedValue(updatedUser);

      const result = await userService.update('user-123', {
        firstName: 'Jane',
        lastName: 'Smith',
      });

      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe('Smith');
    });

    it('fails when user does not exist', async () => {
      vi.mocked(mockUserRepository.update).mockRejectedValue(
        new Error('ConditionalCheckFailedException')
      );

      await expect(
        userService.update('non-existent', { firstName: 'Jane' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updatePassword', () => {
    it('succeeds when current password is correct and user is active', async () => {
      vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
      vi.mocked(bcryptUtils.bcryptCompare).mockResolvedValue(true);
      vi.mocked(bcryptUtils.bcryptGen).mockResolvedValue('$2b$10$newhash');
      vi.mocked(mockUserRepository.updatePassword).mockResolvedValue(mockUser);

      const result = await userService.updatePassword('user-123', {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword456',
      });

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('fails when user does not exist', async () => {
      vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

      await expect(
        userService.updatePassword('non-existent', {
          currentPassword: 'old',
          newPassword: 'new',
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('fails when user has no password set', async () => {
      const userWithoutPassword = { ...mockUser, passwordHash: undefined };
      vi.mocked(mockUserRepository.findById).mockResolvedValue(
        userWithoutPassword as User
      );

      await expect(
        userService.updatePassword('user-123', {
          currentPassword: 'old',
          newPassword: 'new',
        })
      ).rejects.toThrow(ConflictError);
    });

    it('fails when current password is incorrect', async () => {
      vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
      vi.mocked(bcryptUtils.bcryptCompare).mockResolvedValue(false);

      await expect(
        userService.updatePassword('user-123', {
          currentPassword: 'wrong',
          newPassword: 'new',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('fails when user account is inactive', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      vi.mocked(mockUserRepository.findById).mockResolvedValue(inactiveUser);
      vi.mocked(bcryptUtils.bcryptCompare).mockResolvedValue(true);

      await expect(
        userService.updatePassword('user-123', {
          currentPassword: 'correct',
          newPassword: 'new',
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('linkProvider', () => {
    it('returns user with linked provider', async () => {
      const userWithProvider = {
        ...mockUser,
        providers: [{ provider: 'github', providerUserId: 'github123' }],
      };
      vi.mocked(mockUserRepository.linkProvider).mockResolvedValue(
        userWithProvider
      );

      const result = await userService.linkProvider(
        userWithProvider,
        'encrypted-token'
      );

      expect(result.providers).toHaveLength(1);
      expect(result.providers[0].provider).toBe('github');
    });

    it('fails when provider is already linked to another user', async () => {
      const error = new Error('TransactionCanceledException');
      error.name = 'TransactionCanceledException';
      vi.mocked(mockUserRepository.linkProvider).mockRejectedValue(error);

      await expect(userService.linkProvider(mockUser, 'token')).rejects.toThrow(
        ConflictError
      );
    });
  });

  describe('unlinkProvider', () => {
    it('completes successfully when provider is unlinked', async () => {
      vi.mocked(mockUserRepository.unlinkProvider).mockResolvedValue();

      await expect(
        userService.unlinkProvider('user-123', 'github')
      ).resolves.toBeUndefined();
    });

    it('fails when provider cannot be unlinked', async () => {
      const error = new Error('TransactionCanceledException');
      error.name = 'TransactionCanceledException';
      vi.mocked(mockUserRepository.unlinkProvider).mockRejectedValue(error);

      await expect(
        userService.unlinkProvider('user-123', 'github')
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('delete', () => {
    it('completes successfully when user is deleted', async () => {
      vi.mocked(mockUserRepository.delete).mockResolvedValue();

      await expect(userService.delete('user-123')).resolves.toBeUndefined();
    });

    it('fails when user does not exist', async () => {
      vi.mocked(mockUserRepository.delete).mockRejectedValue(
        new Error('ConditionalCheckFailedException')
      );

      await expect(userService.delete('non-existent')).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('deactivate', () => {
    it('returns deactivated user data', async () => {
      const deactivatedUser = { ...mockUser, isActive: false };
      vi.mocked(mockUserRepository.deactivate).mockResolvedValue(
        deactivatedUser
      );

      const result = await userService.deactivate('user-123');

      expect(result.isActive).toBe(false);
    });

    it('fails when user does not exist', async () => {
      vi.mocked(mockUserRepository.deactivate).mockRejectedValue(
        new Error('ConditionalCheckFailedException')
      );

      await expect(userService.deactivate('non-existent')).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('updateLastLogin', () => {
    it('completes successfully and returns public user data', async () => {
      const timestamp = '2024-01-02T00:00:00.000Z';
      const updatedUser = { ...mockUser, lastLoginAt: timestamp };
      vi.mocked(mockUserRepository.updateLastLogin).mockResolvedValue(
        updatedUser
      );

      const result = await userService.updateLastLogin('user-123', timestamp);

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        lastLoginAt: timestamp,
      });
    });
  });
});
