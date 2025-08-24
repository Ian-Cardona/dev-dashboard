import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { UserService } from '../user.service';
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
} from '../../utils/errors.utils';
import { generateUUID } from '../../utils/uuid.utils';
const mockUserModel = {
  create: vi.fn(),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  updateLastLogin: vi.fn(),
  updatePassword: vi.fn(),
  deactivateUser: vi.fn(),
};
const userService = UserService(mockUserModel);
function toSafeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  describe('create', () => {
    const inputUser = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
    };
    let createdUser;
    beforeEach(() => {
      createdUser = {
        userId: generateUUID(),
        email: inputUser.email,
        firstName: inputUser.firstName,
        lastName: inputUser.lastName,
        isActive: true,
        passwordHash: 'hashed_password',
      };
    });
    it('returns created user without passwordHash on success', async () => {
      mockUserModel.create.mockResolvedValue(createdUser);
      const result = await userService.create(inputUser);
      expect(result).toEqual(toSafeUser(createdUser));
      expect(result).not.toHaveProperty('passwordHash');
      expect(mockUserModel.create).toHaveBeenCalledTimes(1);
      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: inputUser.email,
          firstName: inputUser.firstName,
          lastName: inputUser.lastName,
          isActive: true,
          passwordHash: expect.any(String),
          role: 'user',
        })
      );
    });
    it('throws ConflictError if user already exists (conditional failure)', async () => {
      mockUserModel.create.mockRejectedValue(
        new Error('ConditionalCheckFailedException')
      );
      await expect(userService.create(inputUser)).rejects.toThrow(
        ConflictError
      );
    });
    it('throws DatabaseError for other create failures', async () => {
      mockUserModel.create.mockRejectedValue(new Error('Some DB failure'));
      await expect(userService.create(inputUser)).rejects.toThrow(
        DatabaseError
      );
    });
  });
  describe('findById', () => {
    let user;
    beforeEach(() => {
      user = {
        userId: generateUUID(),
        email: 'email@example.com',
        firstName: 'First',
        lastName: 'Last',
        isActive: true,
        passwordHash: 'secret',
      };
    });
    it('returns user without passwordHash when found', async () => {
      mockUserModel.findById.mockResolvedValue(user);
      const result = await userService.findById(user.userId);
      expect(result).toEqual(toSafeUser(user));
      expect(result).not.toHaveProperty('passwordHash');
      expect(mockUserModel.findById).toHaveBeenCalledWith(user.userId);
    });
    it('throws NotFoundError when user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);
      await expect(userService.findById('nonexistent')).rejects.toThrow(
        NotFoundError
      );
    });
    it('throws DatabaseError on findById failure', async () => {
      mockUserModel.findById.mockRejectedValue(new Error('DB error'));
      await expect(userService.findById('someId')).rejects.toThrow(
        DatabaseError
      );
    });
  });
  describe('findByEmailForAuth', () => {
    let user;
    beforeEach(() => {
      user = {
        userId: generateUUID(),
        email: 'auth@example.com',
        isActive: true,
        passwordHash: 'verysecret',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        firstName: 'Auth',
        lastName: 'User',
        lastLoginAt: new Date().toISOString(),
        passwordUpdatedAt: new Date().toISOString(),
      };
    });
    it('returns user with passwordHash when found', async () => {
      mockUserModel.findByEmail.mockResolvedValue(user);
      const result = await userService.findByEmailForAuth(user.email);
      expect(result).toEqual(user);
      expect(mockUserModel.findByEmail).toHaveBeenCalledWith(user.email);
    });
    it('throws NotFoundError when user not found', async () => {
      mockUserModel.findByEmail.mockResolvedValue(null);
      await expect(
        userService.findByEmailForAuth('unknown@example.com')
      ).rejects.toThrow(NotFoundError);
    });
    it('throws DatabaseError on findByEmail failure', async () => {
      mockUserModel.findByEmail.mockRejectedValue(new Error('DB error'));
      await expect(
        userService.findByEmailForAuth('fail@example.com')
      ).rejects.toThrow(DatabaseError);
    });
  });
  describe('findByEmailForPublic', () => {
    let user;
    beforeEach(() => {
      user = {
        userId: generateUUID(),
        email: 'public@example.com',
        firstName: 'Public',
        lastName: 'User',
        isActive: true,
        passwordHash: 'hidden',
      };
    });
    it('returns user without passwordHash when found', async () => {
      mockUserModel.findByEmail.mockResolvedValue(user);
      const result = await userService.findByEmailForPublic(user.email);
      expect(result).toEqual(toSafeUser(user));
      expect(result).not.toHaveProperty('passwordHash');
      expect(mockUserModel.findByEmail).toHaveBeenCalledWith(user.email);
    });
    it('throws NotFoundError when user not found', async () => {
      mockUserModel.findByEmail.mockResolvedValue(null);
      await expect(
        userService.findByEmailForPublic('unknown@example.com')
      ).rejects.toThrow(NotFoundError);
    });
    it('throws DatabaseError on findByEmail failure', async () => {
      mockUserModel.findByEmail.mockRejectedValue(new Error('DB error'));
      await expect(
        userService.findByEmailForPublic('fail@example.com')
      ).rejects.toThrow(DatabaseError);
    });
  });
  describe('update', () => {
    const updates = { firstName: 'Updated', isActive: false };
    let existingUser;
    beforeEach(() => {
      existingUser = {
        userId: 'TEST_ID',
        email: 'update@example.com',
        firstName: 'OldFirst',
        lastName: 'OldLast',
        isActive: true,
        passwordHash: 'secret',
      };
    });
    it('returns user without passwordHash on successful update', async () => {
      const updatedUser = { ...existingUser, ...updates };
      mockUserModel.update.mockResolvedValue(updatedUser);
      const result = await userService.update(existingUser.userId, updates);
      expect(result).toEqual(toSafeUser(updatedUser));
      expect(mockUserModel.update).toHaveBeenCalledWith(
        existingUser.userId,
        updates
      );
    });
    it('throws NotFoundError when user to update does not exist', async () => {
      const notFoundError = new Error('ConditionalCheckFailedException');
      mockUserModel.update.mockRejectedValue(notFoundError);
      await expect(userService.update('nonexistent', updates)).rejects.toThrow(
        NotFoundError
      );
    });
    it('throws DatabaseError on update failure', async () => {
      mockUserModel.update.mockRejectedValue(new Error('DB failure'));
      await expect(
        userService.update(existingUser.userId, updates)
      ).rejects.toThrow(DatabaseError);
    });
  });
  describe('delete', () => {
    it('completes successfully when deletion succeeds', async () => {
      mockUserModel.delete.mockResolvedValue(undefined);
      await expect(userService.delete('userId')).resolves.toBeUndefined();
      expect(mockUserModel.delete).toHaveBeenCalledWith('userId');
    });
    it('throws NotFoundError when user to delete does not exist', async () => {
      mockUserModel.delete.mockRejectedValue(
        new Error('ConditionalCheckFailedException')
      );
      await expect(userService.delete('nonexistent')).rejects.toThrow(
        NotFoundError
      );
    });
    it('throws DatabaseError on delete failure', async () => {
      mockUserModel.delete.mockRejectedValue(new Error('DB failure'));
      await expect(userService.delete('userId')).rejects.toThrow(DatabaseError);
    });
  });
  describe('updateLastLogin', () => {
    const timestamp = '2025-01-01T12:00:00Z';
    let user;
    beforeEach(() => {
      user = {
        userId: 'userId',
        lastLoginAt: timestamp,
        updatedAt: timestamp,
        passwordHash: 'hidden',
      };
    });
    it('returns user without passwordHash when updated', async () => {
      mockUserModel.updateLastLogin.mockResolvedValue(user);
      const result = await userService.updateLastLogin(user.userId, timestamp);
      expect(result).toEqual(toSafeUser(user));
      expect(mockUserModel.updateLastLogin).toHaveBeenCalledWith(
        user.userId,
        timestamp
      );
    });
    it('throws NotFoundError if user not found', async () => {
      mockUserModel.updateLastLogin.mockRejectedValue(
        new Error('ConditionalCheckFailedException')
      );
      await expect(
        userService.updateLastLogin('nonexistent', timestamp)
      ).rejects.toThrow(NotFoundError);
    });
    it('throws DatabaseError on update failure', async () => {
      mockUserModel.updateLastLogin.mockRejectedValue(new Error('DB failure'));
      await expect(
        userService.updateLastLogin('userId', timestamp)
      ).rejects.toThrow(DatabaseError);
    });
  });
  describe('updatePassword', () => {
    let user;
    beforeEach(() => {
      user = { userId: 'userId', passwordHash: 'newhash' };
    });
    it('returns user without passwordHash when updated', async () => {
      mockUserModel.updatePassword.mockResolvedValue(user);
      const result = await userService.updatePassword(user.userId, 'newhash');
      expect(result).toEqual(toSafeUser(user));
      expect(mockUserModel.updatePassword).toHaveBeenCalledWith(
        user.userId,
        'newhash'
      );
    });
    it('throws NotFoundError if user not found', async () => {
      mockUserModel.updatePassword.mockRejectedValue(
        new Error('ConditionalCheckFailedException')
      );
      await expect(
        userService.updatePassword('nonexistent', 'newhash')
      ).rejects.toThrow(NotFoundError);
    });
    it('throws DatabaseError on update failure', async () => {
      mockUserModel.updatePassword.mockRejectedValue(new Error('DB failure'));
      await expect(
        userService.updatePassword('userId', 'newhash')
      ).rejects.toThrow(DatabaseError);
    });
  });
  describe('deactivateUser', () => {
    let user;
    beforeEach(() => {
      user = { userId: 'userId', isActive: false, passwordHash: 'hidden' };
    });
    it('returns user without passwordHash when deactivated', async () => {
      mockUserModel.deactivateUser.mockResolvedValue(user);
      const result = await userService.deactivateUser(user.userId);
      expect(result).toEqual(toSafeUser(user));
      expect(mockUserModel.deactivateUser).toHaveBeenCalledWith(user.userId);
    });
    it('throws NotFoundError if user not found', async () => {
      mockUserModel.deactivateUser.mockRejectedValue(
        new Error('ConditionalCheckFailedException')
      );
      await expect(userService.deactivateUser('nonexistent')).rejects.toThrow(
        NotFoundError
      );
    });
    it('throws DatabaseError on deactivate failure', async () => {
      mockUserModel.deactivateUser.mockRejectedValue(new Error('DB failure'));
      await expect(userService.deactivateUser('userId')).rejects.toThrow(
        DatabaseError
      );
    });
  });
});
