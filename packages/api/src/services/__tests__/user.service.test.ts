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
import { User, SafeUser } from '../../types/user.type';

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

  const toSafeUser = (user: User): SafeUser => {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
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

      expect(result).toEqual(toSafeUser(createdUser));
      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: inputUser.email,
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
          firstName: inputUser.firstName,
          lastName: inputUser.lastName,
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
          firstName: inputUser.firstName,
          lastName: inputUser.lastName,
          isActive: true,
        })
      );
    });
  });

  describe('findById', () => {
    it('should return user when user exists', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await userService.findById(mockUser.userId);

      expect(result).toEqual(toSafeUser(mockUser));
      expect(mockUserModel.findById).toHaveBeenCalledWith(mockUser.userId);
    });

    it('should throw when user does not exist', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(userService.findById('NONEXISTENT_ID')).rejects.toThrow();
    });

    it('should throw DatabaseError when findById fails', async () => {
      const dbError = new Error('Database error');
      mockUserModel.findById.mockRejectedValue(dbError);

      await expect(userService.findById('TEST_ID')).rejects.toThrow(
        DatabaseError
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user when user exists', async () => {
      mockUserModel.findByEmail.mockResolvedValue(mockUser);

      const result = await userService.findByEmail(mockUser.email);

      expect(result).toEqual(toSafeUser(mockUser)); // important to call toSafeUser
      expect(mockUserModel.findByEmail).toHaveBeenCalledWith(mockUser.email);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockUserModel.findByEmail.mockResolvedValue(null);

      await expect(
        userService.findByEmail('unknown@example.com')
      ).rejects.toThrow();
    });

    it('should throw DatabaseError when findByEmail fails', async () => {
      mockUserModel.findByEmail.mockRejectedValue(new Error('Database error'));

      await expect(userService.findByEmail(mockUser.email)).rejects.toThrow(
        DatabaseError
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

      expect(result).toEqual(toSafeUser(updatedUser));

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

    it('should throw NotFoundError when ConditionalCheckFailedException occurs', async () => {
      const error = new Error('ConditionalCheckFailedException');

      mockUserModel.update.mockRejectedValue(error);

      await expect(
        userService.update('NON_EXISTENT_ID', updateData)
      ).rejects.toThrow();
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
    it('should return SafeUser when last login update succeeds', async () => {
      const updatedUser = { ...mockUser }; // example raw user, will be wrapped by toSafeUser
      mockUserModel.updateLastLogin.mockResolvedValue(updatedUser);

      const result = await userService.updateLastLogin(
        'TEST_USER_ID',
        '2025-01-01T12:00:00Z'
      );

      expect(result).toEqual(toSafeUser(updatedUser));
      expect(mockUserModel.updateLastLogin).toHaveBeenCalledWith(
        'TEST_USER_ID',
        '2025-01-01T12:00:00Z'
      );
    });

    it('should throw NotFoundError if ConditionalCheckFailedException occurs', async () => {
      const error = new Error('ConditionalCheckFailedException');
      mockUserModel.updateLastLogin.mockRejectedValue(error);

      await expect(
        userService.updateLastLogin('NON_EXISTENT_ID', '2025-01-01T12:00:00Z')
      ).rejects.toThrow();
    });

    it('should throw DatabaseError on other failures', async () => {
      mockUserModel.updateLastLogin.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        userService.updateLastLogin('TEST_ID', '2025-01-01T12:00:00Z')
      ).rejects.toThrow(DatabaseError);
    });
  });

  describe('updatePassword', () => {
    it('should return SafeUser when password update succeeds', async () => {
      const updatedUser = { ...mockUser };
      mockUserModel.updatePassword.mockResolvedValue(updatedUser);

      const result = await userService.updatePassword(
        'TEST_USER_ID',
        'new-password'
      );

      expect(result).toEqual(toSafeUser(updatedUser));
      expect(mockUserModel.updatePassword).toHaveBeenCalledWith(
        'TEST_USER_ID',
        'new-password'
      );
    });

    it('should throw NotFoundError if ConditionalCheckFailedException occurs', async () => {
      const error = new Error('ConditionalCheckFailedException');
      mockUserModel.updatePassword.mockRejectedValue(error);

      await expect(
        userService.updatePassword('NON_EXISTENT_ID', 'new-password')
      ).rejects.toThrow();
    });

    it('should throw DatabaseError on other failures', async () => {
      mockUserModel.updatePassword.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        userService.updatePassword('TEST_ID', 'new-password')
      ).rejects.toThrow(DatabaseError);
    });
  });

  describe('deactivateUser', () => {
    it('should return SafeUser when user deactivation succeeds', async () => {
      const updatedUser = { ...mockUser };
      mockUserModel.deactivateUser.mockResolvedValue(updatedUser);

      const result = await userService.deactivateUser('TEST_USER_ID');

      expect(result).toEqual(toSafeUser(updatedUser));
      expect(mockUserModel.deactivateUser).toHaveBeenCalledWith('TEST_USER_ID');
    });

    it('should throw NotFoundError if ConditionalCheckFailedException occurs', async () => {
      const error = new Error('ConditionalCheckFailedException');
      mockUserModel.deactivateUser.mockRejectedValue(error);

      await expect(
        userService.deactivateUser('NON_EXISTENT_ID')
      ).rejects.toThrow();
    });

    it('should throw DatabaseError on other failures', async () => {
      mockUserModel.deactivateUser.mockRejectedValue(
        new Error('Database error')
      );

      await expect(userService.deactivateUser('TEST_ID')).rejects.toThrow(
        DatabaseError
      );
    });
  });
});
