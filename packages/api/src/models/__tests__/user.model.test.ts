import { describe, it, expect, beforeEach } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';

import { toHaveReceivedCommandWith } from 'aws-sdk-client-mock-vitest';
expect.extend({ toHaveReceivedCommandWith });

import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { UserModel } from '../user.model';
import { VALIDATION_CONSTANTS } from '../../constants/validations';
import { User } from '../../types/user.type';

const ddbMock = mockClient(DynamoDBDocumentClient);

export const userModel = UserModel(
  ddbMock as unknown as DynamoDBDocumentClient
);

describe('User Model', () => {
  let mockUser: User;

  beforeEach(() => {
    mockUser = {
      userId: 'TEST_USER12345',
      email: 'test@example.com',
      passwordHash: 'a'.repeat(
        VALIDATION_CONSTANTS.USER.PASSWORD_HASH.MIN_LENGTH
      ),
      createdAt: '2025-07-31T14:42:05.000Z',
      updatedAt: '2025-07-31T14:42:05.000Z',
      isActive: true,
    };
    ddbMock.reset();
  });

  describe('create', () => {
    it('successfully creates user and email lock transactionally', async () => {
      ddbMock.on(TransactWriteCommand).resolves({});
      const result = await userModel.create(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('throws when userId or email already exists (transaction conditional failure)', async () => {
      ddbMock
        .on(TransactWriteCommand)
        .rejects(new Error('ConditionalCheckFailedException'));

      await expect(userModel.create(mockUser)).rejects.toThrow(
        'ConditionalCheckFailedException'
      );
    });

    it('propagates DynamoDB errors in transaction', async () => {
      ddbMock.on(TransactWriteCommand).rejects(new Error('DB error'));
      await expect(userModel.create(mockUser)).rejects.toThrow('DB error');
    });
  });

  describe('findById', () => {
    it('returns user when found', async () => {
      ddbMock.on(GetCommand).resolves({ Item: mockUser });
      const result = await userModel.findById(mockUser.userId);
      expect(result).toEqual(mockUser);
    });

    it('returns null when user not found', async () => {
      ddbMock.on(GetCommand).resolves({});
      const result = await userModel.findById('UNKNOWN_ID');
      expect(result).toBeNull();
    });

    it('returns null when Item is undefined', async () => {
      ddbMock.on(GetCommand).resolves({ Item: undefined });
      const result = await userModel.findById('UNDEFINED_ID');
      expect(result).toBeNull();
    });

    it('propagates DynamoDB errors', async () => {
      ddbMock.on(GetCommand).rejects(new Error('DB error'));
      await expect(userModel.findById('TEST')).rejects.toThrow('DB error');
    });
  });

  describe('findByEmail', () => {
    it('returns user when found', async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: [mockUser],
        Count: 1,
        ScannedCount: 1,
      });

      const result = await userModel.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('returns null when not found', async () => {
      ddbMock.on(QueryCommand).resolves({
        Items: [],
        Count: 0,
        ScannedCount: 0,
      });

      const result = await userModel.findByEmail('unknown@example.com');
      expect(result).toBeNull();
    });

    it('returns null for empty response', async () => {
      ddbMock.on(QueryCommand).resolves({});
      const result = await userModel.findByEmail('test@example.com');
      expect(result).toBeNull();
    });

    it('returns null when Items is undefined', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: undefined });
      const result = await userModel.findByEmail('test@example.com');
      expect(result).toBeNull();
    });

    it('returns first user when multiple found', async () => {
      const secondUser = { ...mockUser, userId: 'TEST_USER67890' };
      ddbMock.on(QueryCommand).resolves({
        Items: [mockUser, secondUser],
        Count: 2,
        ScannedCount: 2,
      });

      const result = await userModel.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('propagates DynamoDB errors', async () => {
      ddbMock.on(QueryCommand).rejects(new Error('DB error'));
      await expect(userModel.findByEmail('test@example.com')).rejects.toThrow(
        'DB error'
      );
    });
  });

  describe('update', () => {
    const updateData = {
      firstName: 'Updated First Name',
      lastName: 'Updated Last Name',
      isActive: false,
    };

    it('successfully updates user with all fields', async () => {
      const mockUpdatedUser = {
        ...mockUser,
        ...updateData,
        updatedAt: '2025-01-02T00:00:00Z',
      };
      ddbMock.on(UpdateCommand).resolves({
        Attributes: mockUpdatedUser,
      });

      const result = await userModel.update('TEST_USER12345', updateData);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('successfully updates user with partial fields', async () => {
      const partialUpdate = { firstName: 'New Name' };
      const mockUpdatedUser = {
        ...mockUser,
        ...partialUpdate,
        updatedAt: '2025-01-02T00:00:00Z',
      };

      ddbMock.on(UpdateCommand).resolves({
        Attributes: mockUpdatedUser,
      });

      const result = await userModel.update('TEST_USER12345', partialUpdate);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('successfully updates with empty object (only updatedAt)', async () => {
      const mockUpdatedUser = {
        ...mockUser,
        updatedAt: '2025-01-02T00:00:00Z',
      };
      ddbMock.on(UpdateCommand).resolves({
        Attributes: mockUpdatedUser,
      });

      const result = await userModel.update('TEST_USER12345', {});
      expect(result).toEqual(mockUpdatedUser);
    });

    it('throws when user does not exist', async () => {
      ddbMock
        .on(UpdateCommand)
        .rejects(new Error('ConditionalCheckFailedException'));

      await expect(
        userModel.update('NONEXISTENT_USER', updateData)
      ).rejects.toThrow('ConditionalCheckFailedException');
    });

    it('propagates DynamoDB errors', async () => {
      ddbMock.on(UpdateCommand).rejects(new Error('DB error'));
      await expect(
        userModel.update('TEST_USER12345', updateData)
      ).rejects.toThrow('DB error');
    });
  });

  describe('delete', () => {
    it('successfully deletes existing user', async () => {
      ddbMock.on(DeleteCommand).resolves({});
      await expect(userModel.delete('TEST_USER12345')).resolves.not.toThrow();
    });

    it('throws when user does not exist', async () => {
      ddbMock
        .on(DeleteCommand)
        .rejects(new Error('ConditionalCheckFailedException'));

      await expect(userModel.delete('NONEXISTENT_USER')).rejects.toThrow(
        'ConditionalCheckFailedException'
      );
    });

    it('propagates DynamoDB errors', async () => {
      ddbMock.on(DeleteCommand).rejects(new Error('DB error'));
      await expect(userModel.delete('TEST_USER12345')).rejects.toThrow(
        'DB error'
      );
    });
  });

  describe('updateLastLogin', () => {
    it('successfully updates last login timestamp', async () => {
      const timestamp = '2025-01-02T10:30:00Z';
      ddbMock.on(UpdateCommand).resolves({});

      await expect(
        userModel.updateLastLogin('TEST_USER12345', timestamp)
      ).resolves.not.toThrow();
    });

    it('throws when user does not exist', async () => {
      ddbMock
        .on(UpdateCommand)
        .rejects(new Error('ConditionalCheckFailedException'));

      await expect(
        userModel.updateLastLogin('NONEXISTENT_USER', '2025-01-02T10:30:00Z')
      ).rejects.toThrow('ConditionalCheckFailedException');
    });

    it('propagates DynamoDB errors', async () => {
      ddbMock.on(UpdateCommand).rejects(new Error('DB error'));
      await expect(
        userModel.updateLastLogin('TEST_USER12345', '2025-01-02T10:30:00Z')
      ).rejects.toThrow('DB error');
    });
  });

  describe('updatePassword', () => {
    it('successfully updates password hash', async () => {
      const passwordHash = '$2b$12$hashedPassword';
      ddbMock.on(UpdateCommand).resolves({});

      await expect(
        userModel.updatePassword('TEST_USER12345', passwordHash)
      ).resolves.not.toThrow();
    });

    it('throws when user does not exist', async () => {
      ddbMock
        .on(UpdateCommand)
        .rejects(new Error('ConditionalCheckFailedException'));

      await expect(
        userModel.updatePassword('NONEXISTENT_USER', '$2b$12$hashedPassword')
      ).rejects.toThrow('ConditionalCheckFailedException');
    });

    it('propagates DynamoDB errors', async () => {
      ddbMock.on(UpdateCommand).rejects(new Error('DB error'));
      await expect(
        userModel.updatePassword('TEST_USER12345', '$2b$12$hashedPassword')
      ).rejects.toThrow('DB error');
    });
  });

  describe('deactivateUser', () => {
    it('successfully deactivates user', async () => {
      ddbMock.on(UpdateCommand).resolves({});

      await expect(
        userModel.deactivateUser('TEST_USER12345')
      ).resolves.not.toThrow();
    });

    it('throws when user does not exist', async () => {
      ddbMock
        .on(UpdateCommand)
        .rejects(new Error('ConditionalCheckFailedException'));

      await expect(
        userModel.deactivateUser('NONEXISTENT_USER')
      ).rejects.toThrow('ConditionalCheckFailedException');
    });

    it('propagates DynamoDB errors', async () => {
      ddbMock.on(UpdateCommand).rejects(new Error('DB error'));
      await expect(userModel.deactivateUser('TEST_USER12345')).rejects.toThrow(
        'DB error'
      );
    });
  });
});
