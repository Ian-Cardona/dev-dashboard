import { UserRepository } from '../user.repository';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { User } from '@dev-dashboard/shared';
import { mockClient } from 'aws-sdk-client-mock';
import { describe, it, expect, beforeEach } from 'vitest';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('UserRepository', () => {
  let userRepo: ReturnType<typeof UserRepository>;

  beforeEach(() => {
    ddbMock.reset();
    userRepo = UserRepository(ddbMock as unknown as DynamoDBDocumentClient);
  });

  describe('createByEmail', () => {
    it('creates user with email and password', async () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      ddbMock.on(TransactWriteCommand).resolves({});

      const result = await userRepo.createByEmail(user);

      expect(result).toEqual(user);
    });

    it('rejects when email is missing', async () => {
      const user: User = {
        id: 'user-123',
        email: '',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await expect(userRepo.createByEmail(user)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('returns user when found', async () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      ddbMock.on(GetCommand).resolves({ Item: user });

      const result = await userRepo.findById('user-123');

      expect(result).toEqual(user);
    });

    it('returns null when user not found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: undefined });

      const result = await userRepo.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('queries EmailIndex', async () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      ddbMock.on(QueryCommand).resolves({ Items: [user] });

      const result = await userRepo.findByEmail('test@example.com');

      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('updates allowed fields', async () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedUser = { ...user, firstName: 'Jane' };
      ddbMock.on(UpdateCommand).resolves({ Attributes: updatedUser });

      const result = await userRepo.update('user-123', {
        firstName: 'Jane',
        lastName: '',
      });

      expect(result.firstName).toBe('Jane');
    });

    it('rejects when no fields to update', async () =>
      await expect(
        userRepo.update('user-123', {
          firstName: '',
          lastName: '',
        })
      ).rejects.toThrow());
  });

  describe('createByOAuth', () => {
    it('creates user with provider', async () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [{ provider: 'github', providerUserId: 'github123' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      ddbMock.on(TransactWriteCommand).resolves({});

      const result = await userRepo.createByOAuth(user, 'encrypted-token');

      expect(result).toEqual(user);
    });
  });

  describe('linkProvider', () => {
    it('adds provider to existing user', async () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [{ provider: 'github', providerUserId: 'github123' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      ddbMock.on(TransactWriteCommand).resolves({});

      const result = await userRepo.linkProvider(user, 'token');

      expect(result).toEqual(user);
    });
  });

  describe('unlinkProvider', () => {
    it('removes provider from user', async () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      ddbMock.on(GetCommand).resolves({ Item: user });
      ddbMock.on(QueryCommand).resolves({
        Items: [{ provider: 'github', providerUserId: 'github123' }],
      });
      ddbMock.on(TransactWriteCommand).resolves({});

      await expect(
        userRepo.unlinkProvider('user-123', 'github')
      ).resolves.toBeUndefined();
    });
  });

  describe('delete', () => {
    it('deletes user by id', async () => {
      ddbMock.on(DeleteCommand).resolves({});

      await expect(userRepo.delete('user-123')).resolves.toBeUndefined();
    });
  });

  describe('findByProvider', () => {
    it('finds user by provider credentials', async () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'user',
        providers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const providerRecord = {
        provider: 'github',
        providerUserId: 'gh123',
        userId: 'user-123',
      };
      ddbMock
        .on(GetCommand)
        .resolvesOnce({ Item: providerRecord })
        .resolvesOnce({ Item: user });

      const result = await userRepo.findByProvider('github', 'gh123');

      expect(result).toEqual(user);
    });

    it('returns null when provider not found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: undefined });

      const result = await userRepo.findByProvider('github', 'gh123');

      expect(result).toBeNull();
    });
  });
});
