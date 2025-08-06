import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockedFunction,
  vi,
} from 'vitest';
import { UserService } from '../user.service';
import { ConflictError, DatabaseError } from '../../utils/errors.utils';
import { IUserModel } from '../../models/user.model';

const mockUserModel = {
  create: vi.fn() as MockedFunction<IUserModel['create']>,
  findById: vi.fn() as MockedFunction<IUserModel['findById']>,
  findByEmail: vi.fn() as MockedFunction<IUserModel['findByEmail']>,
  update: vi.fn() as MockedFunction<IUserModel['update']>,
  delete: vi.fn() as MockedFunction<IUserModel['delete']>,
  updateLastLogin: vi.fn() as MockedFunction<IUserModel['updateLastLogin']>,
  updatePassword: vi.fn() as MockedFunction<IUserModel['updatePassword']>,
  deactivateUser: vi.fn() as MockedFunction<IUserModel['deactivateUser']>,
};

const userService = UserService(mockUserModel);

describe('User Service', () => {
  const mockUser = {
    email: 'test@example.com',
    userId: '22dfb3fc-a956-4add-881b-e91c3f728412',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    passwordHash: 'test-password-hash',
    isActive: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('create', () => {
    it('should return created user when creation succeeds', async () => {
      const inputUser = {
        email: mockUser.email,
        passwordHash: mockUser.passwordHash,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      };

      const createdUser = {
        ...inputUser,
        userId: mockUser.userId,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        isActive: true,
      };

      mockUserModel.create.mockResolvedValue(createdUser);

      const result = await userService.create(inputUser);

      expect(result).toEqual(createdUser);
      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: inputUser.email,
          passwordHash: inputUser.passwordHash,
          firstName: inputUser.firstName,
          lastName: inputUser.lastName,
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          isActive: true,
        })
      );
    });

    it('should throw DatabaseError when user already exists', async () => {
      const conditionalError = new Error('ConditionalCheckFailedException');
      mockUserModel.create.mockRejectedValue(conditionalError);

      const inputUser = {
        email: mockUser.email,
        passwordHash: mockUser.passwordHash,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      };

      const expectedError = new ConflictError(
        `User ${inputUser.email} already exists`
      );

      await expect(userService.create(inputUser)).rejects.toThrow(
        expectedError
      );

      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: inputUser.email,
          passwordHash: inputUser.passwordHash,
          firstName: inputUser.firstName,
          lastName: inputUser.lastName,
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          isActive: true,
        })
      );
    });

    it('should throw DatabaseError when creation fails', async () => {
      const expectedError = new DatabaseError('Failed to create user');
      mockUserModel.create.mockRejectedValue(expectedError);

      const inputUser = {
        email: mockUser.email,
        passwordHash: mockUser.passwordHash,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      };

      await expect(userService.create(inputUser)).rejects.toThrow(
        expectedError
      );
      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: inputUser.email,
          passwordHash: inputUser.passwordHash,
          firstName: inputUser.firstName,
          lastName: inputUser.lastName,
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          isActive: true,
        })
      );
    });
  });

  describe('findById', () => {
    it('should return user when user exists', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await userService.findById(mockUser.email);

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith(mockUser.email);
    });

    it('should return null when user does not exist', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      const result = await userService.findById('NONEXISTENT_ID');

      expect(result).toBeNull();
    });

    it('should throw DatabaseError when findById fails', async () => {
      mockUserModel.findById.mockRejectedValue(new Error('Database error'));

      await expect(userService.findById('TEST_ID')).rejects.toThrow(
        new DatabaseError('Could not find the user')
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user when user exists', async () => {
      mockUserModel.findByEmail.mockResolvedValue(mockUser);

      const result = await userService.findByEmail(mockUser.email);

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findByEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
    });

    it('should return null when user does not exist', async () => {
      mockUserModel.findByEmail.mockResolvedValue(null);

      const result = await userService.findByEmail('unknown@example.com');

      expect(result).toBeNull();
    });

    it('should throw DatabaseError when findByEmail fails', async () => {
      mockUserModel.findByEmail.mockRejectedValue(new Error('Database error'));

      await expect(userService.findByEmail(mockUser.email)).rejects.toThrow(
        new DatabaseError('Could not find the user')
      );
    });
  });

  describe('update', () => {
    const updateData = {
      firstName: 'Updated Name',
      isActive: false,
    };

    it('should return updated user when update succeeds', async () => {
      const updatedUser = { ...mockUser, ...updateData };
      mockUserModel.update.mockResolvedValue(updatedUser);

      const result = await userService.update('TEST_USER_ID', updateData);

      expect(result).toEqual(updatedUser);
      expect(mockUserModel.update).toHaveBeenCalledWith(
        'TEST_USER_ID',
        updateData
      );
    });

    it('should throw DatabaseError when update fails', async () => {
      mockUserModel.update.mockRejectedValue(new Error('Database error'));

      await expect(userService.update('TEST_ID', updateData)).rejects.toThrow(
        new DatabaseError('Could not update the user')
      );
    });
  });

  describe('delete', () => {
    it('should complete successfully when user deletion succeeds', async () => {
      await expect(userService.delete('TEST_USER_ID')).resolves.not.toThrow();
    });

    it('should throw DatabaseError when delete fails', async () => {
      mockUserModel.delete.mockRejectedValue(new Error('Database error'));

      await expect(userService.delete('TEST_ID')).rejects.toThrow(
        new DatabaseError('Could not delete the user')
      );
    });
  });

  describe('updateLastLogin', () => {
    it('should complete successfully when last login update succeeds', async () => {
      await expect(
        userService.updateLastLogin('TEST_USER_ID', '2025-01-01T12:00:00Z')
      ).resolves.not.toThrow();

      expect(mockUserModel.updateLastLogin).toHaveBeenCalledWith(
        'TEST_USER_ID',
        '2025-01-01T12:00:00Z'
      );
    });

    it('should throw DatabaseError when updateLastLogin fails', async () => {
      mockUserModel.updateLastLogin.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        userService.updateLastLogin('TEST_ID', '2025-01-01T12:00:00Z')
      ).rejects.toThrow(
        new DatabaseError('Could not update the user last login')
      );
    });
  });

  describe('updatePassword', () => {
    it('should complete successfully when password update succeeds', async () => {
      const newPassword = 'new-password';

      await expect(
        userService.updatePassword('TEST_USER_ID', newPassword)
      ).resolves.not.toThrow();
      expect(mockUserModel.updatePassword).toHaveBeenCalledWith(
        'TEST_USER_ID',
        newPassword
      );
    });

    it('should throw DatabaseError when updatePassword fails', async () => {
      mockUserModel.updatePassword.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        userService.updatePassword('TEST_ID', 'new-password')
      ).rejects.toThrow(
        new DatabaseError('Could not update the user password')
      );
    });
  });

  describe('deactivateUser', () => {
    it('should complete successfully when user deactivation succeeds', async () => {
      await expect(
        userService.deactivateUser('TEST_USER_ID')
      ).resolves.not.toThrow();
      expect(mockUserModel.deactivateUser).toHaveBeenCalledWith('TEST_USER_ID');
    });

    it('should throw DatabaseError when deactivateUser fails', async () => {
      mockUserModel.deactivateUser.mockRejectedValue(
        new Error('Database error')
      );

      await expect(userService.deactivateUser('TEST_ID')).rejects.toThrow(
        new DatabaseError('Could not deactivate the user')
      );
    });
  });
});
